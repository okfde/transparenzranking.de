var app = angular.module('App', []);

app.factory('ranking', function($http) {
    var overview = null;
    var states = {};
    var data = null;
    var categories = null;
    var keys = null;

    function load(cb) {
        if (!data) {
            Tabletop.init({
                key: 'https://docs.google.com/spreadsheets/d/10QpOTuLp01kl2Dev8ueblqCUFK8GAJD0UJXV6rBhjeo/pubhtml',
                parseNumbers: true,
                callback: function (tabletop_data, tabletop) {
                    data = tabletop_data;
                    cb(null, tabletop_data);
                }
            })
        } else {
            cb(null, data)
        }
    }

    return {
        getOverview: function (cb) {
            if (!overview) {
                $http.get('/static/js/data/overview.json').then(function(response) {
                    overview = response.data;
                    cb(null, overview);
                });
            } else {
                cb(null, overview);
            }
        },
        getState: function(state, cb) {
            console.log('loading states');
            if (!states[state]) {
                $http.get('/static/js/data/states/' + state + '.json').then(function(response) {
                    states[state] = response.data;
                    cb(null, response.data)
                });
            } else {
                cb(null, states[state])
            }
        },
        getOverviewForState: function(state, cb) {
            this.getState(state, function(err, data) {
                categories = Object.keys(data).reduce(function(prev, key) {

                    prev[key] = data[key].reduce(function(prev, elem) {
                        return {points: prev.points + elem.erreichte_punkte, max: prev.max + elem.maximalpunkte}
                    }, {points: 0, max: 0});
                    return prev;
                }, {});
                categories['Gesamt'] = Object.keys(categories).reduce(function(prev, elem) {
                    return {points: prev.points + categories[elem].points, max: prev.max + categories[elem].max }
                }, {points:0, max: 0});
                cb(null, categories);
            })
        },
        getKeysForStates: function(cb) {
            if (!keys) {
                $http.get('/static/js/data/keys.json').then(function(response) {
                    keys = response.data;
                    cb(null, keys);
                });
            } else {
                cb(null, keys);
            }

            // load(function(err, data) {
            //     cb(null, Object.keys(data));
            // })
        },
        getCategoryNames: function(cb) {
            if (!categories) {
                $http.get('/static/js/data/categoryNames.json').then(function(response) {
                    categories = response.data;
                    cb(null, categories);
                });
            } else {
                cb(null, categories);
            }
        }
    }
});

app.controller('BarchartCtrl', function ($scope, ranking) {

    $scope.colors = ['#ffcb64','#ff7c7c','#ff639c','#374053', '#83eeff', '#6ddecb', '#6dffd4'];

    //$scope.activeColor = $scope.colors['Gesamt'];
    $scope.chart_data = [];
    $scope.categories = [];
    $scope.bardata = [];
    $scope.barcat = [];
    $scope.barcolors = ['#ffcb64','#ffcb64','#ffcb64','#ffcb64','#ffcb64','#ffcb64','#ffcb64','#ffcb64','#ffcb64','#ffcb64'];
    $scope.overview_data = [];
    $scope.activeColor = "#f00";

    $scope.loadOverview = function() {
        ranking.getOverview(function(err, data) {
            console.log('overview loaded');
            if (err) {
                console.error(err);
            } else {
                $scope.overview_data = data;
                $scope.activeColor = "#6dffd4";
                ranking.getKeysForStates(function(err, keys) {
                    keys = keys.sort();
                    $scope.bar = keys.map(function(elem, index) {
                        var sum = data.reduce(function(prev, cat) {
                            return prev + cat.entries[elem];
                        }, 0);
                        return {name: elem, sum: sum}
                    })
                    $scope.bar = _.sortBy($scope.bar, 'name');
                    $scope.bardata = _.map($scope.bar, 'sum');
                    $scope.barcat = _.map($scope.bar, 'name');
                });
                $scope.loading_finished = true;
            }
        });
    };

    $scope.catClick = function(category, color) {
        var cat_data = _.find($scope.overview_data, function(elem) { return elem.name === category });
        $scope.bar = _.chain(cat_data.entries)
            .reduce(function(result, value, key) {
                console.log(result);
                result.push({ name:key, value:Math.floor(value * 100 / cat_data.max) });
                return result;
            }, [])
            .sortBy('name')
            .value();
        $scope.bardata = _.map($scope.bar, 'value');
        $scope.barcat = _.map($scope.bar, 'name');
        $scope.activeColor = color;
    };

    ranking.getCategoryNames(function(err, data) {
        if (!err) {
            $scope.categories = data;
            console.log(data);
        } else {
            console.error(data);
        }
    });

    $scope.changeBarData = function(property) {
        $scope.chart_data = getSeriesForCategory(property);
    };

    $scope.loadOverview();
});

app.controller('MapCtrl', function($scope) {

});

app.controller('StateCtrl', function($scope, ranking) {
    $scope.overview_points = 0;
    $scope.overview_max = 100;
    $scope.overview_color = "#6dffd4";
    $scope.informationsrechte_color = "#ffcb64";
    $scope.cat_colors = {
        "Informationsrechte":"#ffcb64",
        "Auskunftspflichten":"#ff7c7c",
        "Ausnahmen": "#ff639c",
        "Antragsstellung":"#d3b4ff",
        "Gebuehren" : "#83eeff",
        "Informationsfreiheitsbeauftragte": "#6ddecb"};
    $scope.cat_names = {
        "Informationsrechte":"Informationsrechte",
        "Auskunftspflichten":"Auskunftspflichten",
        "Ausnahmen": "Ausnahmen",
        "Antragsstellung":"Antragsstellung und Antwort",
        "Gebuehren" : "test",
        "Informationsfreiheitsbeauftragte": "Informationsfreiheitsbeauftragte"};
    $scope.data_cat = [];
    $scope._ = _;

    // Accordeon
    $("dt").click(function(){ // trigger
        $(this).next("dd").slideToggle("fast"); // blendet beim Klick auf "dt" die nächste "dd" ein.
        $(this).next("span").toggleClass('fa-arrow-down');
        $(this).next("span").toggleClass('fa-arrow-up');
    });

    $scope.init = function(state) {
        $scope.state = state;
        loadData(state);
    };

    $scope.getNumber = function(num) {
        return new Array(num);
    }

    function loadData(state) {
        ranking.getState(state, function(err, data) {
            $scope.stateData = data;
        });
        ranking.getOverviewForState(state, function(err, data) {
            $scope.overview_data = data;
            $scope.overview_points = data['Gesamt'].points;
            $scope.overview_label = data['Gesamt'].points + "%";
            for (var cat in data) {
                if (cat !== "Gesamt") {
                    var curr = $scope.overview_data[cat];
                    curr.name = cat;
                    curr.value = Math.round(curr.points * 100 / curr.max);
                    $scope.data_cat.push(curr);
                }
            }
            $scope.informationsrechte_points = data['Informationsrechte'].points;
            $scope.informationsrechte_max = data['Informationsrechte'].max;
            $scope.informationsrechte_label = Math.floor($scope.informationsrechte_points * 100 / $scope.informationsrechte_max) + "%";
        });
    }
});

