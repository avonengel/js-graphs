var chart = dc.scatterPlot("#scatter-chart");

var data = d3.range(1000).map(function() {
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
  // .keyAccessor(function(p) {
  //   return p[0];
  // })
  // .valueAccessor(function(p) {
  //   return p[1];
  // })
  //.brushOn(false)
  .symbolSize(8)
  .clipPadding(10)
  .yAxisLabel("This is the Y Axis!")
  .dimension(xDimension)
  .group(allGroup);

chart.render();
