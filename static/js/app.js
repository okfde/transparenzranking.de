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

    ranking.getOverview(function(err, data) {
        if (err) {
            console.error(err);
        } else {
            $scope.overview_data = data;
            $scope.activeColor = "#6dffd4";
            ranking.getKeysForStates(function(err, keys) {
                keys = keys.sort();
                $scope.bardata = keys.map(function(elem, index) {
                    return data.reduce(function(prev, cat) {
                        return prev + cat.entries[elem];
                    }, 0)
                })
            });
            $scope.barcat = Object.keys(data[0].entries).sort();
        }
    });

    $scope.catClick = function(category, color) {
        console.log("category: " + category);
        console.log("color: " + color);
        var cat_data = _.find($scope.overview_data, function(elem) { return elem.name === category });
        var maxValue = cat_data.max;
        $scope.bardata = Object.values(cat_data.entries).map(function(elem) {
            return parseInt(elem * 100 / maxValue)
        });
        $scope.barcat = Object.keys(cat_data.entries);
        $scope.activeColor = color;
    };

    ranking.getCategoryNames(function(err, data) {
        if (!err) {
            $scope.categories = data;
            $scope.$apply();
            console.log(data);
        } else {
            console.error(data);
        }
    });

    $scope.changeBarData = function(property) {
        $scope.chart_data = getSeriesForCategory(property);
    };
});

app.controller('MapCtrl', function($scope) {

});

app.controller('StateCtrl', function($scope, ranking) {
    $scope.overview_points = 0;
    $scope.overview_max = 100;
    $scope.overview_color = "#6dffd4";
    $scope.informationsrechte_color = "#ffcb64";
    $scope.cat_color = ["#ffcb64", "#ff7c7c", "#ff639c", "#d3b4ff", "#83eeff", "#6ddecb"];
    $scope.data_cat = [];

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

            $scope.$apply();
        });
    }
});

