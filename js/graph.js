function draw(cypher_set){
            

        //  <input type="text" id="cypherBox" class="bar" wrap="hard" style="width:100%;  align:center;" class="form-control" >
         
       if (cypher_set!="1")
       cypher = cypher_set
       else
       var cypher = "MATCH p = ()-[t:time]->(d)-[r:SendTo]->()  RETURN p LIMIT 100";
       
       var config = {
       container_id: "viz",
       server_url:"bolt://10.164.27.117:7687",
       server_user:"neo4j",
       server_password:"12345",
       arrows:true,
        labels: {
                    "A":{
					"caption" : "IpAddress",
                    "size": "OutDegree",
                    "community": "Cluster"
				    },
                    "D":{
                        "caption" : false
				    }
					
					},
      relationships: {
                    
                    "SendTo": {
                        "thickness": "weight",
                        "caption": true,
                        "community": "Red"
                    }
                    },
      relationship_thickness: {
                    "SendTo": "weight"
                                },           
       initial_cypher: cypher
       }
       var viz = new NeoVis.default(config);
       viz.render();
      
}

function draw_live(cypher_set){
            

        //  <input type="text" id="cypherBox" class="bar" wrap="hard" style="width:100%;  align:center;" class="form-control" >
         
       if (cypher_set!="1")
       cypher = cypher_set
       else
       var cypher = "MATCH p = ()-[t:time]->(d)-[r:SendTo]->() WHERE d.Date =~ '20-11-2019.*' OR d.Date =~ '19-11-2019.*' OR d.Date =~ '18-11-2019.*' RETURN p";
       var config = {
       container_id: "vid",
       server_url:"bolt://10.164.27.117:7687",
       server_user:"neo4j",
       server_password:"12345",
       arrows:true,
        labels: {
                    "A":{
					"caption" : "IpAddress",
                    "size": "OutDegree",
                    "community": "Cluster"
				    },
                    "D":{
					"caption" : false
				    }
					
					},
      relationships: {
                                      
                    "SendTo": {
                        "thickness": "weight",
                        "caption": true,
                        "community": "Red",
                        "color":"green"
                    }
                    },
      relationship_thickness: {
                    "SendTo": "weight"
                                },           
       initial_cypher: cypher
       }
       var vid = new NeoVis.default(config);
       vid.render();
      
}
function draw_range(timest){
            
       cypher = "MATCH p = ()-[t:time]->(d)-[r:SendTo]->() WHERE d.Date =~ '"+timest+".*' RETURN p ";
       var config = {
       container_id: "vim",
       server_url:"bolt://10.164.27.117:7687",
       server_user:"neo4j",
       server_password:"12345",
       arrows:true,
        labels: {
                    "A":{
					"caption" : "IpAddress",
                    "size": "OutDegree",
                    "community": "Cluster"
				    },
                    "D":{
					"caption" : false
				    }
					
					},
      relationships: {
                                      
                    "SendTo": {
                        "thickness": "weight",
                        "caption": true,
                        "community": "Red",
                        "color":"green"
                    }
                    },
      relationship_thickness: {
                    "SendTo": "weight"
                                },           
       initial_cypher: cypher
       }
       var vim = new NeoVis.default(config);
       vim.render();
      
}

function createTimeGraph(){
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
   // var svg1 = d3.select("#date")
   // svg1.selectAll("*").remove();
   // var svg2 = d3.select("#timeSvg2")
   // svg2.selectAll("*").remove();
    draw_date1(finalDate1);
    draw_date2(finalDate2);
}       
 
function draw_date1(date)

{
       var cypher = "MATCH p = ()-[t:time]->(d)-[r:SendTo]->() WHERE d.Date =~ '"+date+".*' RETURN p";
       var config = {
       container_id: "date1",
       server_url:"bolt://10.164.27.117:7687",
       server_user:"neo4j",
       server_password:"12345",
       arrows:true,
        labels: {
                    "A":{
					"caption" : "IpAddress",
                    "size": "OutDegree",
                    "community": "Cluster"
				    },
                    "D":{
					"caption" : false
				    }
					
					},
      relationships: {
                                      
                    "SendTo": {
                        "thickness": "weight",
                        "caption": true,
                        "community": "Red",
                        "color":"green"
                    }
                    },
      relationship_thickness: {
                    "SendTo": "weight"
                                },           
       initial_cypher: cypher
       }
       var date1 = new NeoVis.default(config);
       date1.render();
    
}

function draw_date2(date)

{
       var cypher = "MATCH p = ()-[t:time]->(d)-[r:SendTo]->() WHERE d.Date =~ '"+date+".*' RETURN p";
       var config = {
       container_id: "date2",
       server_url:"bolt://10.164.27.117:7687",
       server_user:"neo4j",
       server_password:"12345",
       arrows:true,
        labels: {
                    "A":{
					"caption" : "IpAddress",
                    "size": "OutDegree",
                    "community": "Cluster"
				    },
                    "D":{
					"caption" : false
				    }
					
					},
      relationships: {
                                      
                    "SendTo": {
                        "thickness": "weight",
                        "caption": true,
                        "community": "Red",
                        "color":"green"
                    }
                    },
      relationship_thickness: {
                    "SendTo": "weight"
                                },           
       initial_cypher: cypher
       }
       var date2 = new NeoVis.default(config);
       date2.render();
    
}