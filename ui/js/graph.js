function draw(date, id){
    var width = 700,
        height = 500,
        radius = 4;
    

    var fill = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
    .velocityDecay(0.1)
    .force("x", d3.forceX(width / 2).strength(.1))
    .force("y", d3.forceY(height / 2).strength(.1))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(50).strength(1))
	.force('collision', d3.forceCollide().strength(1).radius(function(d) {return radius + .75}));
    
    var svg = d3.select("#"+id)
        .attr("width", width)
        .attr("height", height);
    
    var node_radius = d3.scaleOrdinal()
        .domain([0, 1, 2, 3, 4, 5])
        .range([5, 5, 7, 5, 10, 5]);
    
    var node_color = d3.scaleOrdinal()
        .domain([0, 1, 2, 3, 4, 5])
        .range(["#AED6F1", "#5DADE2", "#48C9B0", "#148F77","#922B21", "#0E6251"]);

    var path = "/json/graph-".concat(date).concat(".json")
    d3.json(path, function(error, graph) {
        if (error) throw error;
        
        var link = svg.selectAll("line")
            .data(graph.links)
            .enter().append("line");
        var node = svg.selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", function(d) { return node_radius(d.cluster); })
            .style("fill", function(d) { return node_color(d.cluster); })           
            .on('mouseover.fade', fade(0.1))
            .on('mouseout.fade', fade(1))
            .on("mousemove", function() {
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 10) + "px");
                })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(function(d) { return "IP : "+ d.id+"\nCluster : "+d.cluster; })
            
            
        simulation
            .nodes(graph.nodes)
            .on("tick", tick);
        
        simulation.force('link')
            .links(graph.links);
        
        function tick() {
            node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
                .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
        
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
        }
        const linkedByIndex = {};
        graph.links.forEach(d => {
            linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
        });
        
        function isConnected(a, b) {
            return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
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
        });
        
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
}

function getClusterColor(cluster){
    if(cluster = 0){
        return "blue";
    }else if(cluster = 1){
        return "cyan";
    }else if(cluster = 2){
        return "pink";
    }else if(cluster = 3){
        return "yellow";
    }else if(cluster = 4){
        return "red";
    }else if(cluster = 5){
        return "black";
    }
}

function getRadiusForCluster(cluster){
    alert(cluster);
    if(cluster = 0){
        return 4;
    }else if(cluster = 1){
        return 4;
    }else if(cluster = 2){
        return 4;
    }else if(cluster = 3){
        return 6;
    }else if(cluster = 4){
        return 4;
    }else if(cluster = 5){
        return 4;
    }else{
        return 6;
    }
}

function createJSONTimeGraph(){
    var date1 = document.getElementById("graphDate1").value;
    var finalDate1 = date1.slice(8,10) + "-" + date1.slice(5,7) + "-" + date1.slice(0,4);
    var date2 = document.getElementById("graphDate2").value;
    var finalDate2 = date2.slice(8,10) + "-" + date2.slice(5,7) + "-" + date2.slice(0,4);
    $.ajax({
        async:false,
        url : '/timeGraph/' + finalDate1,
        error: function (e) {
            console.dir(e);
        },
        success: function(data) {
            alert("Time Graph Call Successful");
        }
    });
    $.ajax({
        async:false,
        url : '/timeGraph/' + finalDate2,
        error: function (e) {
            console.dir(e);
        },
        success: function(data) {
            alert("Time Graph Call Successful");
        }
    });
    var svg1 = d3.select("#timeSvg1")
    svg1.selectAll("*").remove();
    var svg2 = d3.select("#timeSvg2")
    svg2.selectAll("*").remove();
    draw(finalDate1, 'timeSvg1');
    draw(finalDate2, 'timeSvg2');
}