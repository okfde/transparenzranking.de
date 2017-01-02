d3.json("static/js/germany.json", function(error, topo) {

    var width = 950,
        height = 550;

    console.log(topo);
    var states = topojson.feature(topo, topo.objects.states).features;

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    var projection = d3.geoMercator().scale(2000);

    var path = d3.geoPath().projection(projection);

    var stateLayer = svg.selectAll(".state")
        .data(states)
        .enter()
        .append('g')
        .on("mouseover", function() {
            d3.select(this).select('.feature').style("fill", "#6dffd3");
            d3.select(this).select('.state-label').style("text-decoration", "underline");
        })
        .on("mouseout", function() {
            d3.select(this).select('.feature').style("fill", "#b5c1cd");
            d3.select(this).select('.state-label').style("text-decoration", "none");
        });

    stateLayer
        .append("path")
        .attr("transform", "translate(-400,2100)")
        .attr("class", "feature")
        .style("fill", "#b5c1cd")
        .style("stroke", "#dbdee1")
        .attr("d", path)
        .style("pointer-events", "all");


    stateLayer
        .append("text")
        .attr("class", function(d) { return "state-label " + d.id; })
        .attr("transform", function(d) {
            var position = path.centroid(d)
            position[1] += 2100;
            position[0] -= 450;
            if (d.properties.GEN === "Brandenburg") {
                position[1] -= 30;
                position[0] += 15;
            }
            if (d.properties.GEN === "Berlin") {
                position[1] += 5;
                position[0] += 15;
            }
            if (d.properties.GEN === "Saarland") {
                //position[1] += 25;
                position[0] += 5;
            }
            if (d.properties.GEN === "Bayern")
                position[0] += 40;
            if (d.properties.GEN === "Hamburg")
                position[1] += 5;
            if (d.properties.GEN === "Baden-Württemberg")
                position[0] -= 40;
            if (d.properties.GEN === "Nordrhein-Westfalen")
                position[0] -= 40;
            if (d.properties.GEN === "Sachsen")
                position[0] += 30;
            if (d.properties.GEN === "Hessen")
                position[0] += 30;
            if (d.properties.GEN === "Thüringen")
                position[0] += 20;
            return "translate(" + position + ")";

        })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.GEN; });

    // put boarder around states
    // svg.append("path")
    //     .attr("transform", "translate(-400,2100)")
    //     .datum(topojson.mesh(topo, topo.objects.states, function(a, b) { return a !== b; }))
    //     .attr("class", "mesh")
    //     .attr("d", path);
});
