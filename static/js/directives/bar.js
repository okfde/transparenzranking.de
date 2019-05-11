app.directive('bar', function() {

    return {
        restrict: 'E',
        scope: {
            value: '=',
            max: '=',
            color: '=',
            //desc: '=', //text behind bar
            label: '=' //text inside bar
        },
        template: '<div class="bar"></div>',
        replace: true,
        link: function (scope, element, attrs) {
            var height = 26;

            var width = element[0].clientWidth;

            var canvas = d3.select(element[0])
                .append("svg")
                .attr('width', width)
                .attr('height', height);

            var xscale = d3.scaleLinear()
                .domain([0, scope.max? scope.max : 100])
                .range([0, width]);

            canvas
                .append('rect')
                .attr('height', 26)
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', width)
                .style('fill', 'rgb(233, 234, 238)');

            canvas
                .append('rect')
                .attr('height', 26)
                .attr('x', width - 2)
                .attr('y', 0)
                .attr('width', 2)
                .style('fill', 'rgb(154, 169, 184)');

            canvas
                .append('rect')
                .attr('height', 26)
                .attr('x', 0)
                .attr('y', 0)
                .attr('class', 'bar-rect')
                .attr('width', 0);

            canvas
                .append('text')
                .attr('x', 0)
                .attr('y', 18)
                //.attr('height', 26)
                .attr('width', 20)
                .attr('class','bar-text')
                .text('69%');
            updateChart();
            scope.$watch('value', updateChart);

            function updateChart() {
                xscale = d3.scaleLinear()
                    .domain([0, scope.max? scope.max : 100])
                    .range([0, width]);

                canvas.select('.bar-rect')
                    .style('fill', scope.color ? scope.color : "");

                canvas.select('.bar-rect')
                    .transition()
                    .duration(1000)
                    .attr('width', scope.value ? xscale(scope.value) : 0);


                canvas.select('.bar-text')
                    .transition()
                    .duration(1000)
                    .attr('x', function () {
                        var value = scope.value ? xscale(scope.value) : 0;

                        if (xscale(scope.max) - value > 50) {
                            return value + 10.5;
                        }
                        return value - 35;
                    })
                    .text(scope.label ? scope.label : "")
            }
        }
    };
});