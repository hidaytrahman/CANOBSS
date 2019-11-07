function showDiffBarGraph() {
  // $("#divBarDiff").addClass('showIt');
  // $("#divBarDiff").append('<div class="close-btn">X</div>')
  //$('#divBarDiff').html('');
  var ele = document.getElementById("popupdiff")
  ele.style.visibility = "visible";
  ele.style.opacity = 1;
  negativeGraphs(attributeDiffs.InDegreeDiff,"Nodes with max In Degree Change","InDegree");
  negativeGraphs(attributeDiffs.OutDegreeDiff,"Nodes with max Out Degree Change","OutDegree");
  negativeGraphs(attributeDiffs.ClosenessCDiff,"Nodes with max Closeness Centrality Change","CloseC");
  negativeGraphs(attributeDiffs.DegreeCDiff,"Nodes with max Degree Centrality Change","DegreeC");
  negativeGraphs(attributeDiffs.BetweennessCDiff,"Nodes with max Betweenness Centrality Change","BetweenC");
  negativeGraphs(attributeDiffs.EigenVectorCDiff,"Nodes with max Eigen Vector Centrality Change","EigenC");
  
}

function negativeGraphs(data,name,element) {

  var ele = document.getElementById("bardiff");
  var div = document.createElement("div");
  div.id = "barChart"+element;
  //div.style.width='40%';
  div.classList.add("columnchart-wrapper");
  ele.appendChild(div);
  var data = google.visualization.arrayToDataTable([
      ['Features', 'Difference'],
      [data[0].name, data[0].value],
      [data[1].name, data[1].value],
      [data[2].name, data[2].value],
      [data[3].name, data[3].value],
      [data[4].name, data[4].value]
  ]);

  var options = {
      title: name,
      colors: ['steelblue'],
      height: '80vh',
      legend: { position: 'none' }
  };

  // Instantiate and draw the chart.
  var chart = new google.visualization.BarChart(document.getElementById(div.id));
  chart.draw(data, options);

}

function popupCloseDiff() {
  var ele = document.getElementById("popupdiff")
  ele.style.visibility = "";
  ele.style.opacity = 0;
  var ele1 = document.getElementById("bardiff")
  ele1.innerHTML = "";
}
