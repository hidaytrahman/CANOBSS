function showDiffBarGraph() {

  $("#divBarDiff").addClass('showIt');
  $("#divBarDiff").append('<div class="close-btn">X</div>')
  $('#divBarDiff').html('');
  createNegativeBarGraph(attributeDiffs.InDegreeDiff, false, 'In Degree');
  createNegativeBarGraph(attributeDiffs.OutDegreeDiff, false, 'Out Degree');
  createNegativeBarGraph(attributeDiffs.ClosenessCDiff, true, 'Closeness Centrality');
  createNegativeBarGraph(attributeDiffs.DegreeCDiff, true, 'Degree Centraltiy');
  createNegativeBarGraph(attributeDiffs.BetweennessCDiff, true, 'Betweenness Centrality');
  createNegativeBarGraph(attributeDiffs.EigenVectorCDiff, true, 'Eigen Vector Centrality');
}

function createNegativeBarGraph(data, centrality, name) {
  var size = {
    width: 600,
    height: 300,
    margin: {
      top: 20,
      right: 60,
      bottom: 30,
      left: 60
    }
  };
  var margin = size.margin;
  var width = size.width - margin.left - margin.right;
  var height = size.height - margin.top - margin.bottom;

  if (centrality) {
    var x = d3.scaleLinear()
      .domain([-0.2, 0.2])
      .range([0, width]);
  }
  else {
    var x = d3.scaleLinear()
      .domain([-20, 20])
      .range([0, width]);
  }
  var y = d3.scaleBand()
    .domain(data.map(d => d.name))
    .rangeRound([0, height])
    .padding(0.2);

  var xAxis = d3.axisBottom(x);

  var yAxis = d3.axisLeft(y)
    .tickSize(0);

  var svg = d3.select('#divBarDiff').append('svg')
    .attr('width', size.width)
    .attr('height', size.height);

  var chart = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  chart.append("g")
    .append("text")
    .attr("y", 6)
    .attr("dy", ".71em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "end")
    .text(name);

  var bar = chart.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', d => `bar ${d.value < 0 ? 'negative' : 'positive'}`)
    .attr('x', d => x(Math.min(0, d.value)))
    .attr('y', d => y(d.name))
    .attr('width', d => Math.abs(x(d.value) - x(0)))
    .attr('height', y.bandwidth());

  chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .attr('class', 'axis x')
    .call(xAxis);

  chart.append('g')
    .attr('class', 'axis y')
    .attr('transform', `translate(${x(0)}, 0)`)
    .call(yAxis);
}

function types(d) {
  d.value = +d.value;
  return d;
}
