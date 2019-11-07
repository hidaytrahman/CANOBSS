function draw(date, id) {
    
    var width = 800;
        height = 400;
        radius = 10;
    var graph, store, graphBack;
    var simulation = d3.forceSimulation()
        .velocityDecay(0.1)
        .force("x", d3.forceX(width / 2).strength(.1))
        .force("y", d3.forceY(height / 2).strength(.1))
        .force("charge", d3.forceManyBody().strength(-10))
        .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(25).strength(1));
        //.force('collision', d3.forceCollide().strength(2).radius(function (d) { return radius + .75 }));

    var nodes_list = [];
    var svg = d3.select("#" + id)
        .attr("width", width)
       // .call(responsivefy);
	var defs = svg.append("svg:defs")
	defs.append("pattern")
	.attr("id", function(d) { return "pc"; })
	.attr("width", radius*2)
	.attr("height", radius*2)
	.attr("class", "pattern")
	.append("image")
		.attr("xlink:href", function(d) { return "images/pc.png"; })
		.attr("width", radius*2)
		.attr("height", radius*2)
		.attr("x", 0)
		.attr("y", 0);
	defs.append("pattern")
	.attr("id", function(d) { return "bug"; })
	.attr("width", radius*2)
	.attr("height", radius*2)
	.attr("class", "pattern")
	.append("image")
		.attr("xlink:href", function(d) { return "images/bug.png"; })
		.attr("width", radius*3)
		.attr("height", radius*3)
		.attr("x", 0)
		.attr("y", 0);

    var link = svg.append("g").selectAll(".link"),
        node = svg.append("g").selectAll(".node");

    var node_radius = d3.scaleOrdinal()
        .domain([0, 1, 2, 3])
        .range([20, 8, 6, 4]);

    var node_color = d3.scaleOrdinal()
        .domain([0, 1, 2, 3, 999])
        .range(["url(#bug)", "#F0E68C", "#00FFFF", "#7FFF00", "#000000"]);

    var edge_length = d3.scaleOrdinal()
        .domain([0, 1, 2, 3])
        .range([1.8, 1.5, 1.6, 1.5]);

    $("#btnSearchGraph").on("click", function () {
        typeFilterList = [];
        graph = JSON.parse(JSON.stringify(graphBack));
        var node_ip = document.getElementById("searchGraph").value.replace(/\s/g,'');
        if (node_ip === "") {
            update();
        } else {
            typeFilterList = node_ip.split(',');
            filter();
            update();
        }

    });

    nodesList = [];

    blockedNodes = [];
    typeFilterList = [];
    const linkedByIndex = {};

    var path = "/json/graph-".concat(date).concat(".json")
    d3.json(path, function (err, g) {
        if (err) throw err;

        var nodeByID = {};

        g.nodes.forEach(function (n) {
            nodeByID[n.id] = n;
            nodesList.push(n.id);
        });

        g.links.forEach(function (l) {
            l.sourcecluster = nodeByID[l.source].cluster.toString();
            l.targetcluster = nodeByID[l.target].cluster.toString();
        });
        
        g.links.forEach(d => {
            linkedByIndex[`${d.source},${d.target}`] = 1;
            });
        graph = g;
        store = $.extend(true, {}, g);
        graphBack = JSON.parse(JSON.stringify(graph));
        
        update();
    });

    function update() {
        node = node.data(graph.nodes, function (d) { return d.id; });

        node.exit().remove();
		
		
		
        var newNode = node.enter().append("circle")
            .attr("class", "node")
            .attr("r", function (d) { 
                if(blockedNodes.includes(d.id)){
                    return 4;
                }
                return node_radius(d.cluster); })
            .style("fill", function (d) { 
                if(blockedNodes.includes(d.id)){
                    return "#000000";
                }
                return  node_color(d.cluster); })
            .style("stroke", function(d) { 
                if(d.cluster != 0){
                    return "#000000";
                } 
            })
           // .style("stroke", function(d) { return "#000000" })
            .on('mouseover.fade', fade(0.1))
            .on('mouseout.fade', fade(1))
            .on("mousemove", function () {
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 10) + "px");
            })
            .on("click", function(d){
                $('#bar').html("");
				
				var ele = document.getElementById("popup1")
				ele.style.visibility="visible";
				ele.style.opacity=1;
				if(d.cluster==0)
				{
					anGraphDegree(this);
				}
				else
				{
					document.getElementById("popuph2").textContent = 'Graph Features of Node';
					barGraphDegree(this);
					barGraphCentrality(this);
				}
                // d3.select(this).attr('r', 4)
                //     .style("fill","#000000")
                //     .style("stroke","#000000");
                // var nodeRef = this;
                // store.links.forEach(function(l){
                //     if(l.source === nodeRef.childNodes[0].__data__.id || l.target === nodeRef.childNodes[0].__data__.id){
                //         graph.links.forEach(function (d, i) {
                //             if (l.source === d.source.id && l.target === d.target.id) {
                //                 graph.links.splice(i, 1);        
                //                 graphBack.links.splice(i,1);
                //                 graphBack.nodes = JSON.parse(JSON.stringify(graph.nodes));   
                //                 blockedNodes.push(nodeRef.childNodes[0].__data__.id);                
                //                 update();

                //             }
                //         });    
                //     }
                // });

            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            )

        newNode.append("text")
            .style('font-family', 'Linearicons-Free')
            .attr('font-size', '20px' )
            .text(function(d) { return '\ue839';})
            .attr('x',40)
            .attr('y',40);

        newNode.append("title")
            .text(function (d) { return "cluster: " + d.cluster + "\n" + "id: " + d.id; });

        node = node.merge(newNode);

        link = link.data(graph.links, function (d) { return d.id; });
        link.exit().remove();

        newLink = link.enter().append("line")
            .attr("class", "link");
            //.style("stroke-width", function(d) { return edge_length(d.sourcecluster); })
            //.style("stroke", function(d) { return node_color(d.sourcecluster); });
        newLink.append("title")
            .text(function (d) { 
                if(d.source  instanceof Object){
                    return "source: " + d.source.id + "\n" + "target: " + d.target.id;
                }
                return "source: " + d.source + "\n" + "target: " + d.target;
             });
        link = link.merge(newLink);

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        simulation.alpha(1).alphaTarget(0).restart();

        if(id = "mainSvg"){
            autocomplete_search();
        }

    }

    function isConnected(a, b) {
        return linkedByIndex[`${a.id},${b.id}`] || linkedByIndex[`${b.id},${a.id}`] || a.id === b.id;
    }

    function fade(opacity) {
        return d => {
            node.style('stroke-opacity', function (o) {
                const thisOpacity = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });

            link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));

        };
    }

    function ticked() {
        node.attr("cx", function (d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
            .attr("cy", function (d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

        link.attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    function filter() {
        //	add and remove nodes from data based on type filters

        store.links.forEach(function (l) {
            if (!typeFilterList.includes(l.source) && !typeFilterList.includes(l.target)) {
                graph.links.forEach(function (d, i) {
                    if (l.source === d.source && l.target === d.target) {
                        graph.links.splice(i, 1);
                    }
                });
            }
        });


        store.nodes.forEach(function (n, i) {
            if (!typeFilterList.includes(n.id)) {
                linked = false;
                graph.links.forEach(function (l, i) {
                    if (n.id === l.source || n.id === l.target) {
                        linked = true;
                    }
                });
                if (!linked) {
                    graph.nodes.forEach(function (d, i) {
                        if (n.id === d.id) {
                            graph.nodes.splice(i, 1);
                        }
                    });
                }

            }
        });
    }

    function split( val ) {
        return val.split( /,\s*/ );
    }
    function extractLast( term ) {
        return split( term ).pop();
    }

    function autocomplete_search(){
        $( "#searchGraph" )
          // don't navigate away from the field on tab when selecting an item
          .on( "keydown", function( event ) {
            if ( event.keyCode === $.ui.keyCode.TAB &&
                $( this ).autocomplete( "instance" ).menu.active ) {
              event.preventDefault();
            }
          })
          .autocomplete({
            minLength: 0,
            source: function( request, response ) {
              // delegate back to autocomplete, but extract the last term
              var results = $.ui.autocomplete.filter(
                nodesList, extractLast( request.term ) );
                response(results.slice(0, 5));
            },
            focus: function() {
              // prevent value inserted on focus
              return false;
            },
            select: function( event, ui ) {
              var terms = split( this.value );
              // remove the current input
              terms.pop();
              // add the selected item
              terms.push( ui.item.value );
              // add placeholder to get the comma-and-space at the end
              terms.push( "" );
              this.value = terms.join( ", " );
              return false;
            }
          });
    }

	function anGraphDegree(ref)
	{
		 
		 var ele = document.getElementById("bar");
		var div = document.createElement("div");
		document.getElementById("popuph2").textContent = 'Anamoly Score of Node';
		
		var span = document.createElement("span");
		span.appendChild(document.createTextNode("Last flow of this node is 95% different"));
		
    
	div.appendChild(span);
	ele.appendChild(div);
		 
	   
	 barGraphDegree1(ref);
	
		
	}
	
	function barGraphDegree1(ref){
        var data = [{
                "name": "InDegree",
                "value": 0.33,
        },
            {
                "name": "OutDegree",
                "value": 0.55,
        },
            {
                "name": "ClosenessC",
                "value": 0.44,
        },
            {
                "name": "DegreeC",
                "value": 0.66,
        },
            {
                "name": "BetweenessC",
                "value": 0.88,
        },
            {
                "name": "EigenC",
                "value": 0.44,
        }];

        //sort bars based on value
       var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var y = d3.scaleBand()
          .range([height, 0])
          .padding(0.1);

var x = d3.scaleLinear()
          .range([0, width]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
	var svg1 = d3.select("#bar").append("div")
	var svg=svg1.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

  // format the data
  data.forEach(function(d) {
    d.value = +d.value;
  });

  // Scale the range of the data in the domains
  x.domain([0, d3.max(data, function(d){ return d.value; })])
  y.domain(data.map(function(d) { return d.name; }));
  //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      //.attr("x", function(d) { return x(d.sales); })
      .attr("width", function(d) {return x(d.value); } )
      .attr("y", function(d) { return y(d.name); })
      .attr("height", y.bandwidth());

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
		markovButton()
    }
	function markovButton()
	{
		var ele = document.getElementById("bar");
		var div = document.createElement("div");
		var button = document.createElement("input");
    button.type = "button";
    button.value = "Markov Chain";
    button.onclick = markov;
    div.appendChild(button);
	ele.appendChild(div);
		
	}
    function barGraphDegree(ref){
        var margin = {top: 40, right: 20, bottom: 30, left: 70},
                    width = 260 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;
        var nodeData = ref.childNodes[0].__data__;
      //  $('#popup1').show();
    
        var attributes_name = ['InDegree', 'OutDegree'];
        var attributes_values = [nodeData.in_degree, nodeData.out_degree];
        var attributes_array = [];
        attributes_name.forEach(function(k,i){
            var temp_dict = {'name' : k, 'value' : attributes_values[i]};
            attributes_array.push(temp_dict);
        })

        var attributes_json = JSON.stringify(attributes_array);

        var x = d3.scaleBand()
        .rangeRound([0, width], .1);
        
        var y = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom(x);

        var yAxis = d3.axisLeft(y).ticks(10, "");
        
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {             
                return "<strong>Value:</strong> <span style='color:red'>" + d.value + "</span>";           
        })
        
        var svg = d3.select("#bar").append("svg")
        .attr("width", 300)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);

        x.domain(attributes_array.map(function(d) { return d.name; }));
        y.domain([0, 25]);

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -36)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Value");

        svg.selectAll(".bar")
        .data(attributes_array)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
    }

    function barGraphCentrality(ref){
        var margin = {top: 40, right: 20, bottom: 30, left: 70},
                    width = 460 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;
        var nodeData = ref.childNodes[0].__data__;
      //  $('#popup1').show();
    
        var attributes_name = ['ClosenessC', 'DegreeC', 'BetweenessC', 'EigenC'];
        var attributes_values = [nodeData.closeness_c, nodeData.degree_c, nodeData.betweeness_c, nodeData.eigen_c];
        var attributes_array = [];
        attributes_name.forEach(function(k,i){
            var temp_dict = {'name' : k, 'value' : attributes_values[i]};
            attributes_array.push(temp_dict);
        })

        var x = d3.scaleBand()
        .rangeRound([0, width], .1);
        
        var y = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom(x);

        var yAxis = d3.axisLeft(y).ticks(10, "");
        
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>Value:</strong> <span style='color:red'>" + d.value + "</span>";
        })
        
        var svg = d3.select("#bar").append("svg")
        .attr("width", 500)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);

        x.domain(attributes_array.map(function(d) { return d.name; }));
        y.domain([0, 0.1]);

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -36)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Value");

        svg.selectAll(".bar")
        .data(attributes_array)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
    }
}


var attributeDiffs;

function createJSONTimeGraph() {
    var date1 = document.getElementById("graphDate1").value;
    var finalDate1 = date1.slice(8, 10) + "-" + date1.slice(5, 7) + "-" + date1.slice(0, 4);
    var date2 = document.getElementById("graphDate2").value;
    var finalDate2 = date2.slice(8, 10) + "-" + date2.slice(5, 7) + "-" + date2.slice(0, 4);

    var data_json_date1 = { "date": finalDate1 };
    var data_json_date2 = { "date": finalDate2 };

    var file1Exists = false;
    var file2Exists = false;
    var filePath1 = '/json/graph-'+finalDate1+'.json';
    var filePath2 = '/json/graph-'+finalDate2+'.json';
    file1Exists = checkFileExists(filePath1);
    file2Exists = checkFileExists(filePath2);

    if(!file1Exists){
        $.ajax({
            type: 'POST',
            method: 'POST',
            url: '/timeGraph',
            data: data_json_date1,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function (resultData) {
                var svg1 = d3.select("#timeSvg1");
                svg1.selectAll("*").remove();
                draw(finalDate1, 'timeSvg1');
                console.log(resultData);
            },
            error: function (resultData) {
                alert(resultData);
            }
        });
    }
    if(!file2Exists){
        $.ajax({
            type: 'POST',
            method: 'POST',
            url: '/timeGraph',
            data: data_json_date2,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function (resultData) {
                var svg2 = d3.select("#timeSvg2");
                svg2.selectAll("*").remove();
                draw(finalDate2, 'timeSvg2');
                console.log(resultData);
            },
            error: function (resultData) {
                alert(resultData.responseText + ":" + finalDate2);
            }
        });
    }

    getTop5Diff(finalDate1, finalDate2);
}

function createTimeGraphs(){
    var dateValues = getDateValues();
    $('#attSelect').on('change', function() {
        setTableData();
    });

    document.getElementById('graphDate1').value = dateValues[3]
    document.getElementById('graphDate2').value = dateValues[1]
    createJSONTimeGraph();
    draw(dateValues[2], "timeSvg1");
    draw(dateValues[0], "timeSvg2");

    getTop5Diff(dateValues[2], dateValues[0]);
  
}

function getTop5Diff(date1, date2){
    var data = { "date1": date1, "date2":date2, "count":5 };
    $.ajax({
        type: 'POST',
        method: 'POST',
        url: '/top5',
        data: data,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: function (resultData) {
            attributeDiffs = resultData;  
            setTableData(); 
        },
        error: function (resultData) {
            alert(resultData);
        }
    });
}


function setTableData(){
    var attr = $('#attSelect').children("option:selected").val();
    if(attr === "inDegreeDiff"){var tableData = attributeDiffs.InDegreeDiff;}
    else if(attr === "outDegreeDiff"){var tableData = attributeDiffs.OutDegreeDiff;}
    else if(attr === "closenessCDiff"){var tableData = attributeDiffs.ClosenessCDiff;}
    else if(attr === "degreeCDiff"){var tableData = attributeDiffs.DegreeCDiff;}
    else if(attr === "betweennessCDiff"){var tableData = attributeDiffs.BetweennessCDiff;}
    else if(attr === "eigenCDiff"){var tableData = attributeDiffs.EigenVectorCDiff;}
    $('#attributeDiffTbl tbody').empty();
    var table = document.getElementById("attributeDiffTbl").getElementsByTagName('tbody')[0];
    tableData.forEach(function(item, index){          
        var row = table.insertRow(index);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = item[0];
        cell2.innerHTML = item[1];            
    });
}

function getDateValues(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var currentDateToSearch = dd+"-"+mm+"-"+yyyy;
    var currentDateToShow = yyyy+"-"+mm+"-"+dd;

    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    dd = String(yesterday.getDate()).padStart(2, '0');
    mm = String(yesterday.getMonth() + 1).padStart(2, '0'); //January is 0!
    yyyy = yesterday.getFullYear();

    var yesterdayDateToSearch = dd+"-"+mm+"-"+yyyy;
    var yesterdayDateToShow = yyyy+"-"+mm+"-"+dd;
    return [currentDateToSearch, currentDateToShow, yesterdayDateToSearch, yesterdayDateToShow];
}


function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    // to register multiple listeners for same event type, 
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}
function popupClose()
{
	var ele = document.getElementById("popup1")
	ele.style.visibility="";
	ele.style.opacity=0;
	var ele1 = document.getElementById("bar")
	ele1.innerHTML="";
}
function markov()
{
	var ele = document.getElementById("popup2")
	ele.style.visibility="visible";
	ele.style.opacity=1;
    var $markov = $('#markov');
    var domainName = 'http://localhost:4300/markovchains/#';
    var frameBefore = domainName+'%7B%22tm%22%3A%5B%5B0%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0.5%2C0%2C0%2C0%2C0%2C0%2C0.5%2C0%5D%2C%5B0%2C0.333333333%2C0%2C0%2C0.666666667%2C0%2C0%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0.04%2C0%2C0.12%2C0.52%2C0.04%2C0.12%2C0.04%2C0%2C0%2C0.12%5D%2C%5B0%2C0%2C0.019607843%2C0.176470588%2C0.539215686%2C0.009803922%2C0.039215686%2C0%2C0.009803922%2C0.009803922%2C0.196078431%5D%2C%5B0%2C0%2C0%2C0%2C0.5%2C0%2C0%2C0.5%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0%2C0.875%2C0%2C0%2C0%2C0%2C0.125%2C0%5D%2C%5B0%2C0%2C0%2C0.666666667%2C0.333333333%2C0%2C0%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0%2C0.5%2C0%2C0%2C0%2C0%2C0%2C0.5%5D%2C%5B0%2C0%2C0%2C0.166666667%2C0.5%2C0%2C0%2C0%2C0.166666667%2C0%2C0.166666667%5D%2C%5B0%2C0%2C0.026315789%2C0%2C0.447368421%2C0%2C0.026315789%2C0.026315789%2C0.078947368%2C0.078947368%2C0.315789474%5D%5D%7D';
    var frameDuring = domainName+'%7B"tm"%3A%5B%5B0%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0%2C0.5%2C0%2C0%2C0%2C0.5%5D%2C%5B0%2C0.333333333%2C0%2C0%2C0.666666667%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0.705882353%2C0.294117647%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0.007092199%2C0.021276596%2C0.063829787%2C0.822695035%2C0.021276596%2C0.021276596%2C0.007092199%2C0.035460993%5D%2C%5B0%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0.166666667%2C0.666666667%2C0%2C0.166666667%2C0%2C0%5D%5D%7D';
    var frameAfter = domainName+'%7B%22tm%22%3A%5B%5B0%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0.125%2C0%2C0.25%2C0%2C0%2C0%2C0%2C0%2C0.125%2C0.5%5D%2C%5B0%2C0.333333333%2C0%2C0%2C0.333333333%2C0%2C0%2C0.333333333%2C0%2C0%2C0%5D%2C%5B0%2C0.08%2C0%2C0.12%2C0.36%2C0.08%2C0.12%2C0.12%2C0.04%2C0%2C0.08%5D%2C%5B0%2C0%2C0.0125%2C0.175%2C0.575%2C0.05%2C0.0875%2C0%2C0.0125%2C0.0125%2C0.075%5D%2C%5B0%2C0%2C0.166666667%2C0%2C0.5%2C0%2C0.166666667%2C0.166666667%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0%2C0.75%2C0%2C0.083333333%2C0%2C0%2C0.083333333%2C0.083333333%5D%2C%5B0%2C0.076923077%2C0.076923077%2C0.307692308%2C0%2C0%2C0%2C0.307692308%2C0.076923077%2C0%2C0.153846154%5D%2C%5B0%2C0.181818182%2C0%2C0.090909091%2C0%2C0%2C0%2C0.090909091%2C0.363636364%2C0%2C0.272727273%5D%2C%5B0%2C0%2C0%2C0.166666667%2C0.5%2C0%2C0%2C0%2C0.166666667%2C0%2C0.166666667%5D%2C%5B0%2C0.034482759%2C0%2C0%2C0.275862069%2C0%2C0%2C0.103448276%2C0.137931034%2C0.103448276%2C0.344827586%5D%5D%7D';
    var iframeContent = `
    <section class="markov-wrapper">
        <div class="iframe-wrapper">
            <iframe class="frame-mark frame-before" src=`+frameBefore+` height="100%" width="100%"></iframe>
            <iframe class="frame-mark frame-during" src=`+frameDuring+` height="100%" width="100%"></iframe>
            <iframe class="frame-mark frame-after" src=`+frameAfter+` height="100%" width="100%"></iframe>
        </div>
    <section>
    `;

    $markov.html(iframeContent);	
}

function popupClose2()
{
	var ele = document.getElementById("popup2")
	ele.style.visibility="";
	ele.style.opacity=0;
	var ele1 = document.getElementById("markov")
	ele1.innerHTML="";
}

function checkFileExists(filePath){
    $.ajax({
        type: 'HEAD',
        url: filePath,
        success: function(msg){
          return true;
        },
        error: function(jqXHR, textStatus, errorThrown){
            return false;
        }
      });
}
