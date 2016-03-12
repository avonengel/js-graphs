var chart = dc.scatterPlot("#scatter-chart");

var data = d3.range(10).map(function() {
  return d3.range(2).map(Math.random);
});


var ndx = crossfilter(data),
  xDimension = ndx.dimension(function(d) {
    return d;
  }),
  allGroup = xDimension.group();

chart
  .width(768)
  .height(480)
  .x(d3.scale.linear())
  .y(d3.scale.linear())
  .symbolSize(8)
  .clipPadding(10)
  .yAxisLabel("This is the Y Axis!")
  .dimension(xDimension)
  .transitionDuration(0)
  .group(allGroup);

chart.render();

function addData() {
  var countToAdd = +document.getElementById('numberOfItems').value;
  var newData = d3.range(countToAdd).map(function() {
    return d3.range(2).map(Math.random);
  });
  ndx.add(newData);
  chart.redraw();
}
document.getElementById("addButton").onclick = addData;

document.getElementById("clearButton").onclick = function() {
  ndx.remove();
  chart.redraw();
}
