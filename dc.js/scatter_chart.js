var myScatterChart = dc.scatterPlot("#scatter-chart", "scatter");

var data = d3.range(10).map(function() {
  return d3.range(2).map(Math.random);
});


var ndx = crossfilter(data),
  xDimension = ndx.dimension(function(d) {
    return d;
  }),
  allGroup = xDimension.group();

myScatterChart
  .width(768)
  .height(480)
  .x(d3.scale.linear())
  .y(d3.scale.linear())
  .symbolSize(8)
  .clipPadding(10)
  .dimension(xDimension)
  .transitionDuration(0)
  // .brushOn(false)
  .group(allGroup);


function addData() {
  var countToAdd = +document.getElementById('numberOfItems').value;
  var newData = d3.range(countToAdd).map(function() {
    return d3.range(2).map(Math.random);
  });
  ndx.add(newData);
  dc.redrawAll('scatter');
}
document.getElementById("addButton").onclick = addData;

document.getElementById("clearButton").onclick = function() {
  ndx.remove();
  myScatterChart.redraw();
}

var scatterHistogram = dc.barChart('#scatter-histogram', 'scatter');
var binWidth = 0.1;
var histogramGroup = xDimension.group(function(d) {
  return binWidth * Math.floor(d[0] / binWidth);
});
scatterHistogram
  .width(768)
  .height(480)
  .x(d3.scale.linear())
  .elasticY(true)
  .xUnits(dc.units.fp.precision(binWidth))
  .dimension(xDimension)
  .gap(0)
  // .transitionDuration(0)
  // .brushOn(false)
  .group(histogramGroup);
dc.renderAll('scatter');
