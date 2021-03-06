var yearlyBubbleChart = dc.bubbleChart('#chart');
d3.csv('ndx.csv', function(data) {
  var dateFormat = d3.time.format('%m/%d/%Y');
  var numberFormat = d3.format('.2f');

  data.forEach(function(d) {
    d.dd = dateFormat.parse(d.date);
    d.month = d3.time.month(d.dd); // pre-calculate month for better performance
    d.close = +d.close; // coerce to number
    d.open = +d.open;
  });

  var ndx = crossfilter(data);
  var all = ndx.groupAll();

  var yearlyDimension = ndx.dimension(function(d) {
    return d3.time.year(d.dd).getFullYear();
  });
  var yearlyPerformanceGroup = yearlyDimension.group().reduce(
    /* callback for when data is added to the current filter results */
    function(p, v) {
      ++p.count;
      p.absGain += v.close - v.open;
      p.fluctuation += Math.abs(v.close - v.open);
      p.sumIndex += (v.open + v.close) / 2;
      p.avgIndex = p.sumIndex / p.count;
      p.percentageGain = p.avgIndex ? (p.absGain / p.avgIndex) * 100 : 0;
      p.fluctuationPercentage = p.avgIndex ? (p.fluctuation / p.avgIndex) * 100 : 0;
      return p;
    },
    /* callback for when data is removed from the current filter results */
    function(p, v) {
      --p.count;
      p.absGain -= v.close - v.open;
      p.fluctuation -= Math.abs(v.close - v.open);
      p.sumIndex -= (v.open + v.close) / 2;
      p.avgIndex = p.count ? p.sumIndex / p.count : 0;
      p.percentageGain = p.avgIndex ? (p.absGain / p.avgIndex) * 100 : 0;
      p.fluctuationPercentage = p.avgIndex ? (p.fluctuation / p.avgIndex) * 100 : 0;
      return p;
    },
    /* initialize p */
    function() {
      return {
        count: 0,
        absGain: 0,
        fluctuation: 0,
        fluctuationPercentage: 0,
        sumIndex: 0,
        avgIndex: 0,
        percentageGain: 0
      };
    }
  );
  yearlyBubbleChart /* dc.bubbleChart('#yearly-bubble-chart', 'chartGroup') */
    .width(990)
    .height(250)
    .transitionDuration(1500)
    .margins({
      top: 10,
      right: 50,
      bottom: 30,
      left: 40
    })
    .dimension(yearlyDimension)
    .group(yearlyPerformanceGroup)
    .keyAccessor(function(p) {
      return p.value.absGain;
    })
    .valueAccessor(function(p) {
      return p.value.percentageGain;
    })
    .radiusValueAccessor(function(p) {
      return p.value.fluctuationPercentage;
    })
    .maxBubbleRelativeSize(0.3)
    .x(d3.scale.linear().domain([-2500, 2500]))
    .y(d3.scale.linear().domain([-100, 100]))
    .r(d3.scale.linear().domain([0, 4000]))
    .elasticY(true)
    .elasticX(true)
    .yAxisPadding(100)
    .xAxisPadding(500)
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .xAxisLabel('Index Gain')
    .yAxisLabel('Index Gain %')
    .renderLabel(true)
    .label(function(p) {
      return p.key;
    })
    .renderTitle(true)
    .title(function(p) {
      return [
        p.key,
        'Index Gain: ' + numberFormat(p.value.absGain),
        'Index Gain in Percentage: ' + numberFormat(p.value.percentageGain) + '%',
        'Fluctuation / Index Ratio: ' + numberFormat(p.value.fluctuationPercentage) + '%'
      ].join('\n');
    })
    .yAxis().tickFormat(function(v) {
      return v + '%';
    });
    dc.renderAll();
});
