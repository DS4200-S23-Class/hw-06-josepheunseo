var scatterplot1 = d3.select("#scatterplot1"),
    scatterplot2 = d3.select("#scatterplot2"),
    barChart = d3.select("#barChart");
    
    function brushed() {
  var selection = d3.event.selection;
  if (selection) {
    var [[x0, y0], [x1, y1]] = selection;
    var xScale = x2.scale(), yScale = y2.scale();
    var selectedData = data.filter(function(d) {
      return x0 <= xScale(d.sepal_width) && xScale(d.sepal_width) <= x1
          && y0 <= yScale(d.petal_width) && yScale(d.petal_width) <= y1;
    });
    scatterplot1.selectAll("circle")
        .style("opacity", 0.5)
        .style("stroke", "none");
    scatterplot2.selectAll("circle")
        .style("opacity", 0.5)
        .style("stroke", "none");
    barChart.selectAll("rect")
        .style("stroke", "none");
    scatterplot1.selectAll("circle")
        .filter(function(d) { return selectedData.includes(d); })
        .style("opacity", 1)
        .style("stroke", "orange")
        .style("stroke-width", "2px");
    barChart.selectAll("rect")
        .filter(function(d) { return selectedData.map(function(d) { return d.species; }).includes(d.species); })
        .style("stroke", "orange")
        .style("stroke-width", "2px");
  }
}

var brush = d3.brush()
    .extent([[0, 0], [width2, height2]])
    .on("brush", brushed);

scatterplot2.append("g")
    .attr("class", "brush")
    .call(brush);

