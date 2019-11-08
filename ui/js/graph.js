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
    var svg;
    if (id == "mainSvg") {
        svg = d3.select("#" + id)
            .attr("width", width)
            .call(responsivefy);
    } else {
        svg = d3.select("#" + id)
            .attr("width", width)
        //.call(responsivefy);
    }
    var defs = svg.append("svg:defs")
    defs.append("pattern")
        .attr("id", function (d) { return "pc"; })
        .attr("width", radius * 2)
        .attr("height", radius * 2)
        .attr("class", "pattern")
        .append("image")
        .attr("xlink:href", function (d) { return "images/pc.png"; })
        .attr("width", radius * 2)
        .attr("height", radius * 2)
        .attr("x", 0)
        .attr("y", 0);
    defs.append("pattern")
        .attr("id", function (d) { return "bug"; })
        .attr("width", radius * 2)
        .attr("height", radius * 2)
        .attr("class", "pattern")
        .append("image")
        .attr("xlink:href", function (d) { return "images/bug.png"; })
        .attr("width", radius * 3)
        .attr("height", radius * 3)
        .attr("x", 0)
        .attr("y", 0);

    var link = svg.append("g").selectAll(".link"),
        node = svg.append("g").selectAll(".node");

    var node_radius = d3.scaleOrdinal()
        .domain([0, 1, 2, 3])
        .range([20, 8, 6, 4]);

    var node_color = d3.scaleOrdinal()
        .domain([0, 1, 2, 3, 999])
        .range(["url(#bug)", "#F0E68C", "#00FFFF", "#7FFF00", "#000000"]);

    var edge_length = d3.scaleOrdinal()
        .domain([0, 1, 2, 3])
        .range([1.8, 1.5, 1.6, 1.5]);

    $("#btnSearchGraph").on("click", function () {
        typeFilterList = [];
        graph = JSON.parse(JSON.stringify(graphBack));
        var node_ip = document.getElementById("searchGraph").value.replace(/\s/g, '');
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
                if (blockedNodes.includes(d.id)) {
                    return 4;
                }
                return node_radius(d.cluster);
            })
            .style("fill", function (d) {
                if (blockedNodes.includes(d.id)) {
                    return "#000000";
                }
                return node_color(d.cluster);
            })
            .style("stroke", function (d) {
                if (d.cluster != 0) {
                    return "#000000";
                }
            })
            // .style("stroke", function(d) { return "#000000" })
            .on('mouseover.fade', fade(0.1))
            .on('mouseout.fade', fade(1))
           /* .on("mousemove", function () {
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 10) + "px");
            })*/
            .on("click", function (d) {
                $('#bar').html("");

                var ele = document.getElementById("popup1")
                ele.style.visibility = "visible";
                ele.style.opacity = 1;
                if (d.cluster == 0) {
                    anGraphDegree(this);
                }
                else {
                    document.getElementById("popuph2").textContent = 'Graph Features of Node';
                    barGraphDegree(this);
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
            .attr('font-size', '20px')
            .text(function (d) { return '\ue839'; })
            .attr('x', 40)
            .attr('y', 40);

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
                if (d.source instanceof Object) {
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

        if (id = "mainSvg") {
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
        if (typeFilterList.includes("anomaly")) {
            var list = '';
            store.nodes.forEach(function (n, i) {
                if (n.cluster == 0) {
                    if (list == '') {
                        list = n.id;
                    }
                    else {
                        list = list + ',' + n.id;
                    }
                }
            })
            if (list != '') {
                typeFilterList = list.split(',');
            }


        }


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

    function split(val) {
        return val.split(/,\s*/);
    }
    function extractLast(term) {
        return split(term).pop();
    }

    function autocomplete_search() {
        $("#searchGraph")
            // don't navigate away from the field on tab when selecting an item
            .on("keydown", function (event) {
                if (event.keyCode === $.ui.keyCode.TAB &&
                    $(this).autocomplete("instance").menu.active) {
                    event.preventDefault();
                }
            })
            .autocomplete({
                minLength: 0,
                source: function (request, response) {
                    // delegate back to autocomplete, but extract the last term
                    var results = $.ui.autocomplete.filter(
                        nodesList, extractLast(request.term));
                    response(results.slice(0, 5));
                },
                focus: function () {
                    // prevent value inserted on focus
                    return false;
                },
                select: function (event, ui) {
                    var terms = split(this.value);
                    // remove the current input
                    terms.pop();
                    // add the selected item
                    terms.push(ui.item.value);
                    // add placeholder to get the comma-and-space at the end
                    terms.push("");
                    this.value = terms.join(", ");
                    return false;
                }
            });
    }

    function anGraphDegree(ref) {

        var ele = document.getElementById("bar");
        var div = document.createElement("div");
        document.getElementById("popuph2").textContent = 'Anamoly Score of Node';

        var span = document.createElement("span");
        span.innerHTML = "Last flow of this node is <strong>95%</strong> different from its historical traffic";


        div.appendChild(span);
        ele.appendChild(div);


        barGraphDegree1(ref);


    }
    function barGraphDegree1(ref) {

        var ele = document.getElementById("bar");
        var div = document.createElement("div");
        div.id = "barChart";
        div.classList.add("barchart-wrapper");
        ele.appendChild(div);
        var data = google.visualization.arrayToDataTable([
            ['Features', 'Values', { role: 'annotation' }, { role: 'tooltip' }],
            ['InDegree', .33, '0.33', 'InDegree : Number of incoming connections'],
            ['OutDegree', .55, '0.55', 'OutDegree : Number of outgoing connections'],
            ['ClosenessC', .66, '0.66', 'Closeness Centrality : Average of the shortest path length from one node to every other node'],
            ['DegreeC', .44, '0.44', 'Degree Centrality : Degree of a node ( number of edges)'],
            ['BetweenessC', .88, '0.88', 'Betweeness Centrality : Percentage of shortest path that include a given node'],
            ['EigenC', .44, '0.44', 'Eigen Centrality : Page Rank of a Node']



        ]);

        var options = {
            title: '',
            colors: ['steelblue'],
            height: '80vh',
            legend: { position: 'none' }
        };

        // Instantiate and draw the chart.
        var chart = new google.visualization.BarChart(document.getElementById('barChart'));
        chart.draw(data, options);
        markovButton(ref.childNodes[0].__data__.id);


    }

    function markovButton(ip) {
        var ele = document.getElementById("bar");
        var div = document.createElement("div");
        div.className = 'markov-button-wrapper';
        var button = document.createElement("input");
        button.type = "button";
        button.value = "Behaviour Analysis";
        button.addEventListener('click', function () {
            markov(ip);
        })

        div.appendChild(button);
        ele.appendChild(div);

    }

    function barGraphDegree(ref) {
        var ele = document.getElementById("bar");
        var div = document.createElement("div");
        div.id = "barChart";
        div.classList.add("barchart-wrapper");
        ele.appendChild(div);
        var nodeData = ref.childNodes[0].__data__;
        var data = google.visualization.arrayToDataTable([
            ['Features', 'Values', { role: 'annotation' }, { role: 'tooltip' }],
            ['InDegree', nodeData.in_degree / 100, nodeData.in_degree / 100, 'InDegree : Number of incoming connections'],
            ['OutDegree', nodeData.out_degree / 100, nodeData.out_degree / 100, 'OutDegree : Number of outgoing connections'],
            ['ClosenessC', nodeData.closeness_c, nodeData.closeness_c, 'Closeness Centrality : average of the shortest path length from one node to every other node'],
            ['DegreeC', nodeData.degree_c, nodeData.degree_c, 'Degree Centrality : Degree of a node ( number of edges)'],
            ['BetweenessC', nodeData.betweeness_c, nodeData.betweeness_c, 'Betweeness Centrality : Percentage of shortest path that include a given node'],
            ['EigenC', nodeData.eigen_c, nodeData.eigen_c, 'Eigen Centrality : Page Rank of a Node']



        ]);

        var options = {
            title: '',
            colors: ['steelblue'],

            legend: { position: 'none' }
        };

        // Instantiate and draw the chart.
        var chart = new google.visualization.BarChart(document.getElementById('barChart'));
        chart.draw(data, options);

    }

}


var attributeDiffs;

function createJSONTimeGraph() {
    var date1 = document.getElementById("graphDate1").value;
    var finalDate1 = date1.slice(8, 10) + "-" + date1.slice(5, 7) + "-" + date1.slice(0, 4);
    var date2 = document.getElementById("graphDate2").value;
    var finalDate2 = date2.slice(8, 10) + "-" + date2.slice(5, 7) + "-" + date2.slice(0, 4);

    // var data_json_date1 = { "date": finalDate1 };
    // var data_json_date2 = { "date": finalDate2 };

    // var file1Exists = false;
    // var file2Exists = false;
    // var filePath1 = '/json/graph-' + finalDate1 + '.json';
    // var filePath2 = '/json/graph-' + finalDate2 + '.json';
    // file1Exists = fileExists(filePath1);
    // file2Exists = fileExists(filePath2);
    createGraph(finalDate1, "timeSvg1");
    createGraph(finalDate2, "timeSvg2");
    getTop5Diff(finalDate1, finalDate2);
}

function createTimeGraphs() {
    var dateValues = getDateValues();
    $('#attSelect').on('change', function () {
        setTableData();
    });

    document.getElementById('graphDate1').value = dateValues[3]
    document.getElementById('graphDate2').value = dateValues[1]
    createJSONTimeGraph();
}

function getTop5Diff(date1, date2) {
    var data = { "date1": date1, "date2": date2, "count": 5 };
    $.ajax({
        type: 'POST',
        method: 'POST',
        url: '/top5',
        data: data,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: function (resultData) {
            attributeDiffs = resultData;
        },
        error: function (resultData) {
            alert(resultData);
        }
    });
}


function getDateValues() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var currentDateToSearch = dd + "-" + mm + "-" + yyyy;
    var currentDateToShow = yyyy + "-" + mm + "-" + dd;

    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    dd = String(yesterday.getDate()).padStart(2, '0');
    mm = String(yesterday.getMonth() + 1).padStart(2, '0'); //January is 0!
    yyyy = yesterday.getFullYear();

    var yesterdayDateToSearch = dd + "-" + mm + "-" + yyyy;
    var yesterdayDateToShow = yyyy + "-" + mm + "-" + dd;
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

function popupClose() {
    var ele = document.getElementById("popup1")
    ele.style.visibility = "";
    ele.style.opacity = 0;
    var ele1 = document.getElementById("bar")
    ele1.innerHTML = "";
}

function markov(ip) {
    var ele = document.getElementById("popup2")
    ele.style.visibility = "visible";
    ele.style.opacity = 1;
    var $markov = $('#markov');
    var domainName = './markovchains/index.html#';
    var frameBefore = domainName + '%7B%22states%22%3A%5B%221%22%2C%22A%22%2C%22B%22%2C%22D%22%2C%22E%22%2C%22d%22%2C%22e%22%2C%22r%22%2C%22s%22%2C%22u%22%2C%22v%22%5D%2C%22tm%22%3A%5B%5B0%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0.5%2C0%2C0%2C0%2C0%2C0%2C0.5%2C0%5D%2C%5B0%2C0.333333333%2C0%2C0%2C0.666666667%2C0%2C0%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0.04%2C0%2C0.12%2C0.52%2C0.04%2C0.12%2C0.04%2C0%2C0%2C0.12%5D%2C%5B0%2C0%2C0.019607843%2C0.176470588%2C0.539215686%2C0.009803922%2C0.039215686%2C0%2C0.009803922%2C0.009803922%2C0.196078431%5D%2C%5B0%2C0%2C0%2C0%2C0.5%2C0%2C0%2C0.5%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0%2C0.875%2C0%2C0%2C0%2C0%2C0.125%2C0%5D%2C%5B0%2C0%2C0%2C0.666666667%2C0.333333333%2C0%2C0%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0%2C0.5%2C0%2C0%2C0%2C0%2C0%2C0.5%5D%2C%5B0%2C0%2C0%2C0.166666667%2C0.5%2C0%2C0%2C0%2C0.166666667%2C0%2C0.166666667%5D%2C%5B0%2C0%2C0.026315789%2C0%2C0.447368421%2C0%2C0.026315789%2C0.026315789%2C0.078947368%2C0.078947368%2C0.315789474%5D%5D%7D';
    var frameDuring = domainName + '%7B%22states%22%3A%5B%221%22%2C%22A%22%2C%22B%22%2C%22E%22%2C%22i%22%2C%22r%22%2C%22s%22%2C%22s%22%5D%2C%22tm%22%3A%5B%5B0%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0%2C0.5%2C0%2C0%2C0%2C0.5%5D%2C%5B0%2C0.333333333%2C0%2C0%2C0.666666667%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0.705882353%2C0.294117647%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0.007092199%2C0.021276596%2C0.063829787%2C0.822695035%2C0.021276596%2C0.021276596%2C0.007092199%2C0.035460993%5D%2C%5B0%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0.166666667%2C0.666666667%2C0%2C0.166666667%2C0%2C0%5D%5D%7D';
    var frameAfter = domainName + '%7B%22states%22%3A%5B%221%22%2C%22A%22%2C%22B%22%2C%22D%22%2C%22E%22%2C%22d%22%2C%22e%22%2C%22r%22%2C%22s%22%2C%22u%22%2C%22v%22%5D%2C%22tm%22%3A%5B%5B0%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0.125%2C0%2C0.25%2C0%2C0%2C0%2C0%2C0%2C0.125%2C0.5%5D%2C%5B0%2C0.333333333%2C0%2C0%2C0.333333333%2C0%2C0%2C0.333333333%2C0%2C0%2C0%5D%2C%5B0%2C0.08%2C0%2C0.12%2C0.36%2C0.08%2C0.12%2C0.12%2C0.04%2C0%2C0.08%5D%2C%5B0%2C0%2C0.0125%2C0.175%2C0.575%2C0.05%2C0.0875%2C0%2C0.0125%2C0.0125%2C0.075%5D%2C%5B0%2C0%2C0.166666667%2C0%2C0.5%2C0%2C0.166666667%2C0.166666667%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0%2C0.75%2C0%2C0.083333333%2C0%2C0%2C0.083333333%2C0.083333333%5D%2C%5B0%2C0.076923077%2C0.076923077%2C0.307692308%2C0%2C0%2C0%2C0.307692308%2C0.076923077%2C0%2C0.153846154%5D%2C%5B0%2C0.181818182%2C0%2C0.090909091%2C0%2C0%2C0%2C0.090909091%2C0.363636364%2C0%2C0.272727273%5D%2C%5B0%2C0%2C0%2C0.166666667%2C0.5%2C0%2C0%2C0%2C0.166666667%2C0%2C0.166666667%5D%2C%5B0%2C0.034482759%2C0%2C0%2C0.275862069%2C0%2C0%2C0.103448276%2C0.137931034%2C0.103448276%2C0.344827586%5D%5D%7D';
    var iframeContent = `
    <section class="markov-wrapper">
        <div class="ip-info-hr">
            <strong>Infected Node: </strong><span>`+ ip + `</span>
            <strong>Destination Node: </strong><span>192.168.77.99</span>
        </div>

        <div class="iframe-wrapper">
            <iframe class="frame-mark frame-before" src=`+ frameBefore + ` height="100%" width="100%"></iframe>
            <iframe class="frame-mark frame-during" src=`+ frameDuring + ` height="100%" width="100%"></iframe>
            <iframe class="frame-mark frame-after" src=`+ frameAfter + ` height="100%" width="100%"></iframe>
        </div>

        <div class="state-details">
            <label>State Details <span class="mif-info"></span></label>
        </div>

        <div class="more-details">
            <div class="close-it-details">X</div>
            <img src="./images/state-details.PNG">
        </div>
    </section>
    `;

    $markov.html(iframeContent);

    $('.state-details').on("mouseenter", function() {
        $(".more-details").addClass('isOn');
    })

    $('.state-details').on("mouseout", function() {
        $(".more-details").removeClass('isOn');
    });

    
}

function popupClose2() {
    var ele = document.getElementById("popup2")
    ele.style.visibility = "";
    ele.style.opacity = 0;
    var ele1 = document.getElementById("markov")
    ele1.innerHTML = "";
}

function fileExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status == 200;
}

function createGraph(date,svg_id){
    var path = '/json/graph-' + date + '.json';
    var exists = fileExists(path);
    var data_json_date = { "date": date };
    if(!exists){
        $.ajax({
            type: 'POST',
            method: 'POST',
            url: '/timeGraph',
            data: data_json_date,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function (resultData) {
                var svg = d3.select("#"+svg_id);
                svg.selectAll("*").remove();
                draw(date, svg_id);
                console.log(resultData);
            },
            error: function (resultData) {
                console.log(resultData.responseText + ":" + date);
            }
        });  
    }else{
        d3.select("#"+svg_id).selectAll('*').remove();
        draw(date, svg_id);
    }
}
