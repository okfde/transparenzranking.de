$(document).ready(function() {
    var categoryColor = '#6dffd4';
    var overview_data = {};

    d3.json('static/js/overview.json', function(data) {
        overview_data = data;
        updateBarchart(getSeriesForOverview())
    });

    var categories= ['Hamburg', 'Schleswig-Holstein', 'Berlin', 'Bremen', 'Rheinland-Pfalz','NRW',
        'Mecklenburg-Vorpommern','Brandenburg','Sachsen-Anhalt','Thüringen','Saarland','Baden-Württemberg','Bayern',
        'Hessen','Niedersachsen','Sachsen'];

    var colors = ['#0000b4','#0082ca','#0094ff','#0d4bcf','#0066AE','#074285','#00187B','#285964','#405F83','#416545','#4D7069','#6E9985','#7EBC89','#0283AF','#79BCBF','#99C19E'];

    var xscale = d3.scaleLinear()
        .domain([0,100])
        .range([0,622]);

    var yscale = d3.scaleLinear()
        .domain([0,categories.length])
        .range([0,480]);

    var colorScale = d3.scaleQuantize()
        .domain([0,categories.length])
        .range(colors);

    function updateBarchart(data) {
        var canvas = d3.select('#wrapper')
            .append('svg')
            .attr('width', 900)
            .attr('height',550);

        var chart_background = canvas.append('g')
            .attr("transform", "translate(0,0)")
            .attr('id','bars-background')
            .selectAll('rect-background')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'rect-background')
            .attr('height',26)
            .attr('x', 0)
            .attr('y', function(d,i){ return yscale(i); })
            .style('fill', '#e9eaee')
            .attr('width', xscale(100));

        var chart_description = canvas.append('g')
            .attr("transform", "translate(0,0)")
            .attr('id','bars-background')
            .selectAll('rect-background')
            .data(data)
            .enter()
            .append('text')
            .attr('x', xscale(100) + 10)
            .attr('y',function(d,i){ return yscale(i) + 19 })
            .text(function(d){ return d.name; })
            .style('fill', '#112233')
            .style('font-size','14px');

        var chart_background_sep = canvas.append('g')
            .attr("transform", "translate(0,0)")
            .attr('id','bars-background')
            .selectAll('rect-background')
            .data(data)
            .enter()
            .append('rect')
            .attr('height', 26)
            .attr('class', 'bars-backround-sep')
            .attr('x', xscale(100) - 2)
            .attr('y', function(d,i){ return yscale(i); })
            .style('fill', '#9aa9b8')
            .attr('width', 2)
            .text('test');

        var chart = canvas.append('g')
            .attr("transform", "translate(0,0)")
            .attr('id','bars')
            .selectAll('.rect-val')
            .data(data)
            .enter()
            .append('rect')
            .attr('height',26)
            .attr('class', 'rect-value')
            .attr('x', 0)
            .attr('y', function(d,i){ return yscale(i); })
            .style('fill', categoryColor)
            .attr('width',function(){ return 0; });


        var transit = d3.select("svg").selectAll(".rect-value")
            .data(data)
            .transition()
            .duration(1000)
            .attr("width", function(d) {return xscale(d.score); });

        var transitext = d3.select('#bars')
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr('x',function(d) {return xscale(d.score) + 10.5})
            .attr('y',function(d,i){ return yscale(i) + 19 })
            .text(function(d){ return d.score + "%"; })
            .style('fill', '#000')
            .style('font-size','14px');
    }

    // Accordeon
    $("dt").click(function(){ // trigger
        $(this).next("dd").slideToggle("fast"); // blendet beim Klick auf "dt" die nächste "dd" ein.
        $(this).next("span").toggleClass('fa-arrow-down');
        $(this).next("span").toggleClass('fa-arrow-up');
    });

    function getSeriesForCategory(property) {
        var series = overview_data.map((state) => {
            var result = { points: 0, max: 0 };
            for (var i = 0; i < state.scoring.length; i++) {
               var curr = state.scoring[i];
               if (curr.name === property) {
                   result = {points: curr.points, max: curr.maxpoints}
               }
            }
            return { name: state.name, score: result.points * 100 / result.max}
        });
        console.log(series);
        return series;
    }

    function getSeriesForOverview() {
        var series = overview_data.map((state) => {
            var score = state.scoring.reduce((prev, cat) => {
                prev.points += cat.points;
                prev.max += cat.maxpoints;
                return prev;
            }, {points: 0, max : 0});
            return {name: state.name, score: score.points * 100 / score.max}
        });
        return series.sort((a,b) => { return b.score - a.score });
    }

    $('.vis-btn-cat').click(function() {
        console.log($(this).attr('data-cat'));
        updateBarchart(getSeriesForCategory(($(this).attr('data-cat'))));
    });
});

