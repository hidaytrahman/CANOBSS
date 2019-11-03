

function draw(date, id) {
    var width = 500,
        height = 500,
        radius = 4;
    var graph, store, graphBack;
    var simulation = d3.forceSimulation()
        .velocityDecay(0.1)
        .force("x", d3.forceX(width / 2).strength(.1))
        .force("y", d3.forceY(height / 2).strength(.1))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(50).strength(1))
        .force('collision', d3.forceCollide().strength(1).radius(function (d) { return radius + .75 }));

    var svg = d3.select("#" + id)
        .attr("width", width)
        .attr("height", height);


    var link = svg.append("g").selectAll(".link"),
        node = svg.append("g").selectAll(".node");

    var node_radius = d3.scaleOrdinal()
        .domain([0, 1, 2, 3])
        .range([14, 9, 7, 5]);

    var node_color = d3.scaleOrdinal()
        .domain([0, 1, 2, 3, 999])
        .range(["#DC143C", "#F0E68C", "#00FFFF", "#7FFF00", "#000000"]);

    $("#btnSearchGraph").on("click", function () {
        typeFilterList = [];
        graph = JSON.parse(JSON.stringify(graphBack));
        var node_ip = document.getElementById("searchGraph").value
        if (node_ip === "") {
            update();
        } else {
            typeFilterList = node_ip.split(',');
            filter();
            update();
        }

    });


    blockedNodes = []
    typeFilterList = [];
    const linkedByIndex = {};

    var path = "/json/graph-".concat(date).concat(".json")
    d3.json(path, function (err, g) {
        if (err) throw err;

        var nodeByID = {};

        g.nodes.forEach(function (n) {
            nodeByID[n.id] = n;
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
                return node_color(d.cluster); })
            .style("stroke", function(d) { return "#696969" })
            .on('mouseover.fade', fade(0.1))
            .on('mouseout.fade', fade(1))
            .on("mousemove", function () {
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 10) + "px");
            })
            .on("click", function(){
                d3.select(this).attr('r', 4)
                    .style("fill","#000000")
                    .style("stroke","#000000");
                var nodeRef = this;
                store.links.forEach(function(l){
                    if(l.source === nodeRef.childNodes[0].__data__.id || l.target === nodeRef.childNodes[0].__data__.id){
                        graph.links.forEach(function (d, i) {
                            if (l.source === d.source.id && l.target === d.target.id) {
                                graph.links.splice(i, 1);        
                                graphBack.links.splice(i,1);
                                graphBack.nodes = JSON.parse(JSON.stringify(graph.nodes));   
                                blockedNodes.push(nodeRef.childNodes[0].__data__.id);                
                                update();

                            }
                        });    
                    }
                });
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            )

        newNode.append("title")
            .text(function (d) { return "cluster: " + d.cluster + "\n" + "id: " + d.id; });

        node = node.merge(newNode);

        link = link.data(graph.links, function (d) { return d.id; });
        link.exit().remove();

        newLink = link.enter().append("line")
            .attr("class", "link");
        newLink.append("title")
            .text(function (d) { return "source: " + d.source + "\n" + "target: " + d.target; });
        link = link.merge(newLink);

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        simulation.alpha(1).alphaTarget(0).restart();

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
}



function createJSONTimeGraph() {
    var date1 = document.getElementById("graphDate1").value;
    var finalDate1 = date1.slice(8, 10) + "-" + date1.slice(5, 7) + "-" + date1.slice(0, 4);
    var date2 = document.getElementById("graphDate2").value;
    var finalDate2 = date2.slice(8, 10) + "-" + date2.slice(5, 7) + "-" + date2.slice(0, 4);

    var data_json_date1 = { "date": finalDate1 };
    var data_json_date2 = { "date": finalDate2 };
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