var app = angular.module('App', []);

const getMaxFor = (category, items) => (
    items.filter(item => item.kategorie == category).reduce((sum, item) => sum + item.maximalpunkte, 0)
);

function getTotalFor(data, name) {
    return Math.round(Object.keys(data.categories).reduce((sum, category) =>
        sum + Math.round(
        data.states[name]
            .filter(i => i.kategorie == category)
            .reduce((prev, item) => prev + item.erreichte_punkte, 0)
        * 100
        / getMaxFor(category, data.states[name])
        ),
        0
    ) / Object.keys(data.categories).length);
}

app.factory('ranking', function ($http) {
    var data = null;
    var categories = null;

    return {
        getData: function (cb) {
            if (!data) {
                $http.get('/static/js/data.json').then(function (response) {
                    data = response.data;
                    cb(null, data);
                });
            } else {
                cb(null, data);
            }
        },
        getOverviewForState: function (state, cb) {
            this.getData(function (err, data) {
                categories = Object.keys(data.categories).reduce((prev, category) => ({
                    ...prev,
                    [category]: data.states[state]
                        .filter(item => item.kategorie == category)
                        .reduce(
                            (prev, item) => ({
                                points: prev.points + item.erreichte_punkte,
                                max: prev.max + item.maximalpunkte
                            }),
                            {points: 0, max: 0}
                        )
                }), {});
                categories['Gesamt'] = {
                    points: getTotalFor(data, state),
                    max: 100
                }
                cb(null, categories);
            })
        },
    }
});

app.controller('BarchartCtrl', function ($scope, ranking) {

    $scope.colors = ['#ffe500', '#f7a600', '#596b01', '#9a0052', '#009ee3', '#004079', '#3695D8'];

    //$scope.activeColor = $scope.colors['Gesamt'];
    $scope.chart_data = [];
    $scope.categories = [];
    $scope.bardata = [];
    $scope.barcat = [];
    $scope.barcolors = ['#ffe500', '#ffe500', '#ffe500', '#ffe500', '#ffe500', '#ffe500', '#ffe500', '#ffe500', '#ffcb64', '#ffcb64'];
    $scope.overview_data = [];
    $scope.activeColor = "#f00";
    $scope.show_info = false;
    $scope.cat_info = {};
    $scope.active_cat = '';
    $scope.active_info = '';

    $scope.loadOverview = function () {
        $scope.show_info = false;
        ranking.getData(function (err, data) {
            if (err) {
                console.error(err);
                return;
            }
            $scope.drafts = data.drafts;
            const barcolors = Object.keys(data.states).map(() => '#3695D8');
            $scope.bar = Object.keys(data.states).sort().map(name => ({
                name,
                sum: getTotalFor(data, name)
            }));

            $scope.bar = _.sortBy($scope.bar, [({name}) => name != 'Bund', 'sum']).reverse();
            $scope.bardata = _.map($scope.bar, 'sum');
            $scope.barcat = _.map($scope.bar, 'name');
            $scope.barcaptions = $scope.barcat;
            $scope.activeColor = barcolors;
            $scope.loading_finished = true;
        });
    };

    $scope.catClick = function (category, color) {
        $scope.show_info = true;
        $scope.active_cat = category;
        ranking.getData((err, data) => {
            $scope.active_info = data.categories[category];
            const barentries = Object.entries(data.states).map(([name, items]) => ({
                name,
                value: Math.round(
                    100 *
                    items.filter(i => i.kategorie == category).reduce((sum, i) => sum + i.erreichte_punkte, 0)
                    /
                    getMaxFor(category, items)
                )
            }));
            $scope.bar = _.map($scope.barcat, (order, index) => _.find(barentries, ['name', order]));
            $scope.bardata = _.map($scope.bar, 'value');
            $scope.barcat = _.map($scope.bar, 'name');
            $scope.barcaptions = $scope.barcat;
            $scope.activeColor = Object.keys(data.states).map(() => color);
        })
    };

    ranking.getData((err, data) => {
        $scope.categories = Object.keys(data.categories)
    })

    $scope.loadOverview();
});

app.controller('MapCtrl', function ($scope) {

});

app.controller('StateCtrl', function ($scope, ranking) {
    $scope.overview_points = 0;
    $scope.overview_max = 100;
    $scope.overview_color = "#3695D8";
    $scope.informationsrechte_color = "#ffcb64";
    $scope.cat_colors = {
        "Lobbyregister": "#ffe500",
        "Legislativer Fußabdruck": "#f7a600",
        "Karenzzeit": "#596b01",
        "Verhaltensregeln": "#9a0052",
    };
    $scope.cat_names = {
        "Lobbyregister": "Lobbyregister",
        "Legislativer Fußabdruck": "Legislativer Fußabdruck",
        "Karenzzeit": "Karenzzeit",
        "Verhaltensregeln": "Verhaltensregeln",
    };
    $scope.data_cat = [];
    $scope._ = _;

    $scope.init = function (state) {
        $scope.state = state;
        loadData(state);
    };

    $scope.getNumber = function (num) {
        return new Array(num);
    }

    function loadData(state) {
        ranking.getOverviewForState(state, function (err, data) {
            $scope.overview_data = data;
            const points = data['Gesamt'].points;
            $scope.overview_points = points;
            $scope.overview_label = points + "%";
            for (var cat in data) {
                if (cat !== "Gesamt") {
                    var curr = $scope.overview_data[cat];
                    curr.name = cat;
                    curr.value = Math.round(curr.points * 100 / curr.max);
                    $scope.data_cat.push(curr);
                }
            }
        });
    }

    $scope.indicator_click = function ($event) { // trigger
        var elem = $event.currentTarget;
        $(elem).next("dd").slideToggle("fast"); // blendet beim Klick auf "dt" die nächste "dd" ein.
        $(elem).find("span").toggleClass('fa-caret-down');
        $(elem).find("span").toggleClass('fa-caret-right');
    }
});



