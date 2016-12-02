var app = angular.module('IFG-index', []);

app.controller('MainCtrl', function (data,$scope) {
    data.getIndexData( function(result) {
        $scope.indexData = result.data;
        $scope.indexCategories = result.names;
        $scope.test = 'yes';
        console.log(result);

        $scope.indexData = Object.keys($scope.indexData).map(function(currentIndex) {
            var currentSet = $scope.indexData[currentIndex];
            var score = 0;
            var scoreMax = 0;
            for (var currentIndicatorIndex in currentSet) {
                var currentIndicator = currentSet[currentIndicatorIndex];
                for (currentOptionIndex in currentIndicator) {
                    var currentOption = currentIndicator[currentOptionIndex];
                    scoreMax += currentOption.Maximalpunkte;
                    score += currentOption['erreichte Punkte'];
                }
            }
            currentSet.score = score;
            currentSet.maxScore = scoreMax;
            currentSet.name = currentIndex;
            return currentSet;
        });
        $scope.indexData = $scope.indexData.sort(function(a,b) {
            return b.score - a.score;
        })

        $scope.$apply();
    })
});

app.directive('indexVis', function() {
    return {
        templateUrl: 'views/indexVis.html',
        scope: {
            indexInfo: '=info',
            identifier: '@'
        },
        link: function (scope) {
             console.log(scope.indexInfo);
            var indexArray = Object.keys(scope.indexInfo).sort().reduce(function(prev, value) {
                prev.push(value);
                return prev;
            }, []);

            console.log(scope.identifier);
            var svgContainer = d3.select('#' + scope.identifier).append('svg');

            console.log(svgContainer);

            svgContainer
                .selectAll('rect')
                .data(indexArray)
                .enter()
                .append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("x", function(d,i) { return i * 12 })
                .attr("fill", "green");
        }
    };
});


app.factory('data', function() {
    //https://docs.google.com/spreadsheets/d/10QpOTuLp01kl2Dev8ueblqCUFK8GAJD0UJXV6rBhjeo/edit?usp=sharing
    var spreadsheet = "https://docs.google.com/spreadsheets/d/10QpOTuLp01kl2Dev8ueblqCUFK8GAJD0UJXV6rBhjeo/pubhtml";
    return {
        getIndexData: function (cb) {
            Tabletop.init({
                key: spreadsheet,
                parseNumbers: true,
                callback: function(result) {
                    var indexdata = {data:{},names:{}};
                    for (var key in result) {
                        if (!result.hasOwnProperty(key)) continue;
                        var district = result[key];
                        var categories = district.elements.reduce(function(prev, curr) {
                            var category = curr['Kategorie'].trim();
                            console.log(category);
                            if (!prev[category]) {
                                prev[category] = {};
                            }
                            prev[category][curr['Bezeichnung']] = curr;
                            return prev;
                        }, {});
                        indexdata.data[key] = categories;
                        indexdata.names = Object.keys(categories);
                    }
                    console.log(result);
                    cb(indexdata);
                }
            });
        }
    }
});

//https://sheets.googleapis.com/v4/spreadsheets/10QpOTuLp01kl2Dev8ueblqCUFK8GAJD0UJXV6rBhjeo/values