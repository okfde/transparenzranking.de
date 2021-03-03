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
            var width;
            var height = 400;
            //var barheight = height /

            function updateWidth() {
                width = window.innerWidth > 600 ? 600 : 400;
            }

            updateWidth();

            var canvas = d3.select(element[0])
                .append("div")
                .classed("svg-container", true) //container class to make it responsive
                .append("svg")
                //responsive SVG needs these 2 attributes and no width and height attr
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", `0 0 ${width} ${height + 30}`)
                //class to make it responsive
                .classed("svg-content-responsive", true);

            window.addEventListener('resize', () => {
                updateWidth();
                canvas.attr("viewBox", `0 0 ${width} ${height + 30}`).attr('test','wat');
                updateChart();
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
                var barwidth = width - margin;

                const yMargin = (i) => i === scope.data.length - 1 ? 20 : 0;

                var xscale = d3.scaleLinear()
                    .domain([0, xmax])
                    .range([0, barwidth - barpadding]);

                var yscale = d3.scaleLinear()
                    .domain([0, scope.data.length])
                    .range([0, height]);

                chart_background
                    .selectAll('.rect-background')
                    .data(scope.data)
                    .enter()
                    .append('rect')
                    .attr('class', 'rect-background')
                    .attr('height', 20)
                    .attr('x', 0)
                    .attr('y', (d, i) => yscale(i) + yMargin(i))
                    .style('fill', '#e9eaee')
                    .attr('width', xscale(xmax));

                chart_description
                    .selectAll('.chart-description')
                    .data(scope.data)
                    .enter()
                    .append('a')
                        .attr('class', 'chart-description')
                        .attr('href', function(d, i) {
                            var slug = scope.caption[i].toLowerCase()
                            slug = slug.replace('ü', 'ue')
                            slug = slug.replace(/[^\w]/g, '-')
                            slug = slug.replace(/-{2,}/, '-').replace(/-$/, '')
                            return '/laender/' + slug + '/'
                        })
                    .append('text')
                    .attr('x', xscale(xmax) + 5)
                    .attr('y', (d, i) => yscale(i) + yMargin(i) + 15)
                    .text((d, i) => scope.caption[i])
                    .style('fill', '#112233')
                    .style('font-size', '9pt');

                chart_background_sep
                    .selectAll('.bars-backround-sep')
                    .data(scope.data)
                    .enter()
                    .append('rect')
                    .attr('height', 20)
                    .attr('class', 'bars-backround-sep')
                    .attr('x', xscale(xmax) - 2)
                    .attr('y', (d, i) => yscale(i) + yMargin(i))
                    .style('fill', '#9aa9b8')
                    .attr('width', 2);

                var chartGroup = chart
                    .selectAll('.bar')
                    .data(scope.data);


                chartGroup
                    .enter()
                    .append('rect')
                    .attr('height', 20)
                    .attr('class', 'bar')
                    .style('fill', (d, i) =>
                        Array.isArray(scope.colors)
                            ? scope.colors[i % scope.colors.length]
                            : scope.colors
                    );

                chartGroup

                    .attr('x', 0)
                    .attr('y', (d, i) => yscale(i) + yMargin(i))
                    // .attr('width', function (d) {
                    //     return xscale(d);
                    // });

                chart.selectAll('.bar-text')
                    .data(scope.data)
                    .enter()
                    .append('text')
                    .attr('class', 'bar-text')
                    .attr('y', (d, i) => yscale(i) + yMargin(i) + 14)
                    .style('font-size', '9pt')
                    .text(d => d + '%')

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
                    .attr("width", d => xscale(d))
                    .style('fill', (d, i) =>
                        Array.isArray(scope.colors)
                            ? scope.colors[i % scope.colors.length]
                            : scope.colors
                    )

                var transittext = canvas.selectAll(".bar-text")
                    .data(scope.data)
                    .transition()
                    .duration(1000)
                    .attr('x', d =>
                        xscale(xmax) - xscale(d) > 50
                            ? xscale(d) + 10.5
                            : xscale(d) - 35
                    )
                    .text(d => d + "%");
            }
        }
    }
});
