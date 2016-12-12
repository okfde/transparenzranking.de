d3.json("static/data/germany.json", function(error, topo) {

    var width = 950,
        height = 550;

    console.log(topo);
    var states = topojson.feature(topo, topo.objects.states).features;

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    var projection = d3.geoMercator().scale(2000);

    var path = d3.geoPath().projection(projection);

    svg.selectAll("path")
        .data(states)
        .enter()
        .append("path")
        .attr("transform", "translate(-400,2100)")
        .attr("class", "feature")
        .style("fill", "#b5c1cd")
        .style("stroke", "#dbdee1")
        .attr("d", path)
        .on("mouseover", function() {
            d3.select(this).style("fill", "#6dffd3")
        })
        .on("mouseout", function() {
            d3.select(this).style("fill", "#b5c1cd")
        });

    svg.selectAll(".state-label")
        .data(states)
        .enter()
        .append("text")
        .attr("class", function(d) { return "state-label " + d.id; })
        .attr("transform", function(d) {
            var position = path.centroid(d)
            position[1] += 2100;
            position[0] -= 450;
            if (d.properties.GEN === "Brandenburg")
                position[1] -= 20;
            if (d.properties.GEN === "Bayern")
                position[0] += 40;
            if (d.properties.GEN === "Sachsen")
                position[0] += 20;
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
