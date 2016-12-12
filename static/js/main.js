$(document).ready(function() {
    var categoryColor = '#6dffd4';

    var categories= ['Hamburg', 'Schleswig-Holstein', 'Berlin', 'Bremen', 'Rheinland-Pfalz','NRW',
        'Mecklenburg-Vorpommern','Brandenburg','Sachsen-Anhalt','Thüringen','Saarland','Baden-Württemberg','Bayern',
        'Hessen','Niedersachsen','Sachsen'];

    var dollars = [69,66,63,62,56,45,41,39,38,32,32,32,0,0,0,0];

    var colors = ['#0000b4','#0082ca','#0094ff','#0d4bcf','#0066AE','#074285','#00187B','#285964','#405F83','#416545','#4D7069','#6E9985','#7EBC89','#0283AF','#79BCBF','#99C19E'];

    var grid = d3.range(25).map(function(i){
        return {'x1':0,'y1':0,'x2':0,'y2':480};
    });

    var tickVals = grid.map(function(d,i){
        if(i > 0){ return i * 10; }
        else if(i === 0){ return "100";}
    });

    var xscale = d3.scaleLinear()
        .domain([0,100])
        .range([0,622]);

    var yscale = d3.scaleLinear()
        .domain([0,categories.length])
        .range([0,480]);

    var colorScale = d3.scaleQuantize()
        .domain([0,categories.length])
        .range(colors);

    var canvas = d3.select('#wrapper')
        .append('svg')
        .attr('width', 900)
        .attr('height',550);

    var chart_background = canvas.append('g')
        .attr("transform", "translate(0,0)")
        .attr('id','bars-background')
        .selectAll('rect-background')
        .data(dollars)
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
        .data(dollars)
        .enter()
        // .append('a')
        // .attr({"xlink:href": "#"})
        .append('text')
        .attr('x', xscale(100) + 10)
        .attr('y',function(d,i){ return yscale(i) + 19 })
        .text(function(d,i){ return categories[i]; })
        .style('fill', '#112233')
        .style('font-size','14px');

    var chart_background_sep = canvas.append('g')
        .attr("transform", "translate(0,0)")
        .attr('id','bars-background')
        .selectAll('rect-background')
        .data(dollars)
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
        .data(dollars)
        .enter()
        .append('rect')
        .attr('height',26)
        .attr('class', 'rect-value')
        .attr('x', 0)
        .attr('y', function(d,i){ return yscale(i); })
        .style('fill', categoryColor)
        .attr('width',function(d){ return 0; });


    var transit = d3.select("svg").selectAll(".rect-value")
        .data(dollars)
        .transition()
        .duration(1000)
        .attr("width", function(d) {return xscale(d); });

    var transitext = d3.select('#bars')
        .selectAll('text')
        .data(dollars)
        .enter()
        .append('text')
        .attr('x',function(d) {return xscale(d) + 10.5})
        .attr('y',function(d,i){ return yscale(i) + 19 })
        .text(function(d){ return d + "%"; })
        .style('fill', '#000')
        .style('font-size','14px')
});

