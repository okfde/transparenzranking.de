app.directive('barchart', function() {

    return {
        restrict: 'E',
        scope: {
            data: '=',
            caption: '=',
            colors: '=',
            max: '='
        },
        template: '<div class="barchart"></div>',
        replace: true,
        link: function (scope, element, attrs) {
            var width = 600;
            var height = 400;
            //var barheight = height /

            var grid = d3.range(25).map(function (i) {
                return {'x1': 0, 'y1': 0, 'x2': 0, 'y2': 480};
            });

            var canvas = d3.select(element[0])
                .append("div")
                .classed("svg-container", true) //container class to make it responsive
                .append("svg")
                //responsive SVG needs these 2 attributes and no width and height attr
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 600 400")
                //class to make it responsive
                .classed("svg-content-responsive", true);

            var tickVals = grid.map(function (d, i) {
                if (i > 0) {
                    return i * 10;
                }
                else if (i === 0) {
                    return "100";
                }
            });

            var chart_background = canvas.append('g')
                .attr("transform", "translate(0,0)")
                .attr('id', 'chart-background');
            var chart_description = canvas.append('g')
                .attr("transform", "translate(0,0)")
                .attr('id', 'chart-description');
            var chart_background_sep = canvas.append('g')
                .attr("transform", "translate(0,0)")
                .attr('id', 'chart-background-sep');
            var chart = canvas.append('g')
                .attr("transform", "translate(0,0)")
                .attr('id', 'bars');

            scope.$watch('caption', function (newVal, oldVal) {
                scope.caption = newVal;
                updateChart();
            });

            scope.$watch('data', function (newVal, oldVal) {
                //newVal = newVal || [];
                scope.data = newVal;
                updateChart();
            });

            scope.$watch('colors', function (newVal, oldVal) {
                //newVal = newVal || [];
                scope.colors = newVal;
                updateChart();
            });

            function updateChart() {
                var margin = 100;
                var barpadding = 70;
                var xmax = parseInt(scope.max) ? parseInt(scope.max) : d3.max(scope.data);
                console.log(xmax);
                var barwidth = width - margin;

                var xscale = d3.scaleLinear()
                    .domain([0, xmax])
                    .range([0, barwidth - barpadding]);

                var yscale = d3.scaleLinear()
                    .domain([0, scope.data.length])
                    .range([0, height]);

                var colorScale = d3.scaleQuantize()
                    .domain([0, scope.caption.length])
                    .range(scope.colors);

                chart_background
                    .selectAll('.rect-background')
                    .data(scope.data)
                    .enter()
                    .append('rect')
                    .attr('class', 'rect-background')
                    .attr('height', 20)
                    .attr('x', 0)
                    .attr('y', function (d, i) {
                        return yscale(i);
                    })
                    .style('fill', '#e9eaee')
                    .attr('width', xscale(xmax));

                chart_description
                    .selectAll('.chart-description')
                    .data(scope.data)
                    .enter()
                    .append('text')
                    .attr('class', 'chart-description')
                    .attr('x', xscale(xmax) + 5)
                    .attr('y', function (d, i) {
                        return yscale(i) + 15
                    })
                    .text(function (d, i) {
                        return scope.caption[i];
                    })
                    .style('fill', '#112233')
                    .style('font-size', '9pt');

                chart_background_sep
                    .selectAll('rect-background')
                    .data(scope.data)
                    .enter()
                    .append('rect')
                    .attr('height', 20)
                    .attr('class', 'bars-backround-sep')
                    .attr('x', xscale(xmax) - 2)
                    .attr('y', function (d, i) {
                        return yscale(i);
                    })
                    .style('fill', '#9aa9b8')
                    .attr('width', 2)
                    .text('test');

                var chartGroup = chart
                    .selectAll('.bar')
                    .data(scope.data);


                chartGroup
                    .enter()
                    .append('rect')
                    .attr('height', 20)
                    .attr('class', 'bar')
                    .style('fill', function (d, i) {
                        if (Array.isArray(scope.colors)) {
                            return scope.colors[i % scope.colors.length];
                        }
                        else {
                            return scope.colors;
                        }
                    });

                chartGroup

                    .attr('x', 0)
                    .attr('y', function (d, i) {
                        return yscale(i);
                    })
                    // .attr('width', function (d) {
                    //     return xscale(d);
                    // });

                chart.selectAll('.bar-text')
                    .data(scope.data)
                    .enter()
                    .append('text')
                    .attr('class', 'bar-text')
                    .attr('y', function (d, i) {
                        return yscale(i) + 14
                    })
                    .style('font-size', '9pt')
                    .text(function(d) {
                        return d + '%'
                    })

                // chartGroupAppend.append('text')
                //     .attr('class', 'bar-text')
                //
                // chartGroup
                //     .attr('x', function (d) {
                //         return xscale(d) + 10.5
                //     })
                //     .attr('y', function (d, i) {
                //         return yscale(i) + 19
                //     })
                //     .text(function (d) {
                //         return d;
                //     })
                //     .style('fill', '#000')
                //     .style('font-size', '14px');


                var transit = canvas.selectAll(".bar")
                    .data(scope.data)
                    .transition()
                    .duration(1000)
                    .attr("width", function (d) {
                        return xscale(d);
                    })
                    .style('fill', function (d, i) {
                        if (Array.isArray(scope.colors)) {
                            return scope.colors[i % scope.colors.length];
                        }
                        else {
                            return scope.colors;
                        }
                    })

                var transittext = canvas.selectAll(".bar-text")
                    .data(scope.data)
                    .transition()
                    .duration(1000)
                    .attr('x', function (d) {
                        if (xscale(xmax) - xscale(d) > 50)
                            return xscale(d) + 10.5;
                        else
                            return xscale(d) - 35;
                    })
                    .text(function (d) {
                        return d + "%";
                    });
            }
        }
    }
});
