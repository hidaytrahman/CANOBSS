# -*- coding: utf-8 -*-
"""
Created on Wed Oct 23 14:19:25 2019

@author: 10060638
"""

import pandas as pd
import networkx as nx
import json
from networkx.readwrite import json_graph
import flask
import os
import sompy
import numpy as np
from flask import send_from_directory
from flask import jsonify
from flask import request


data = pd.read_csv("ia-crime-moreno.csv")

app = flask.Flask(__name__, static_folder="ui")

@app.route('/')
def static_proxy():
    return app.send_static_file('index.html')

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('ui\js', path)

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('ui\css', path)

@app.route('/data/<path:path>')
def send_data(path):
    return send_from_directory('ui\data', path)

@app.route('/images/<path:path>')
def send_images(path):
    return send_from_directory('ui\images', path)

@app.route('/json/<path:path>')
def send_json(path):
    return send_from_directory('ui\json', path)

@app.route('/markovchains/<path:path>')
def send_markov(path):
    return send_from_directory('ui\markovchains', path)

@app.route('/animation/<path:path>')
def send_animation(path):
    return send_from_directory('ui\animation', path)

@app.route('/timeGraph', methods=['POST'])
def timeGraph():
    date = ""
    
    if request.method == "POST":
        date = request.form["date"]
    
    if os.path.exists('ui/json/graph-'+date+'.json'):
        return "Success", 200 
    
    networkGraph = nx.DiGraph()

    for i in range(len(data)):
        if(data['Time'][i][:10] == date): 
            networkGraph.add_edge(data['Source'][i],data['Destination'][i], time = data['Time'][i])
    
    if(len(networkGraph.nodes) == 0):
        return "No Network Data Found", 400
    
    for n in networkGraph:
        networkGraph.node[n]['name'] = n
        
    
    graphData = pd.DataFrame(columns = ['Node', 'InDegree', 'OutDegree', 'ClosenessC', 'DegreeC', 'BetweennessC', 'EigenVectorC']) 
    count = 0 
    
    closeness_centrality = nx.closeness_centrality(networkGraph)
    degree_centrality = nx.degree_centrality(networkGraph)
    betweenness_centrality = nx.betweenness_centrality(networkGraph)
    eigenvector_centrality = nx.eigenvector_centrality(networkGraph, max_iter=100000)
    for node in networkGraph.nodes:
        graphData.loc[count] = [node, float(networkGraph.in_degree[node]), float(networkGraph.out_degree[node]), closeness_centrality[node], degree_centrality[node], betweenness_centrality[node], eigenvector_centrality[node]]
        count+=1
    
    mapsize = [20,20]
    som = sompy.SOMFactory.build(graphData[['InDegree', 'OutDegree', 'ClosenessC', 'DegreeC', 'BetweennessC', 'EigenVectorC']].values, mapsize, mask=None, mapshape='planar', lattice='rect', normalization='var', initialization='pca', 
                                 neighborhood='gaussian', training='batch', name='sompy')
    som.train(n_job=1, verbose='info') 
    
   
    map_labels = som.cluster(n_clusters=4)
    data_labels = np.array([map_labels[int(k)] for k in som._bmu[0]])
    unique, counts = np.unique(data_labels, return_counts=True)
    unique_count = dict(zip(unique, counts))
    sorted_dict = sorted(unique_count.items(), key = 
             lambda kv:(kv[1], kv[0]))
    
    dict_final = {}
    order_count = 0
    for entry in sorted_dict:
        dict_final[entry[0]] = order_count
        order_count+=1
        
    for i in range(len(data_labels)):
        data_labels[i] = dict_final[data_labels[i]]
        
    count = 0
    node_cluster = {}
    
    for node in networkGraph.nodes:
        node_cluster[node] = int(data_labels[count])
        count+=1
        
    
    nx.set_node_attributes(networkGraph, node_cluster, 'cluster')
    nx.set_node_attributes(networkGraph, dict(networkGraph.in_degree), 'in_degree')
    nx.set_node_attributes(networkGraph, dict(networkGraph.out_degree), 'out_degree')
    nx.set_node_attributes(networkGraph, closeness_centrality, 'closeness_c')
    nx.set_node_attributes(networkGraph, degree_centrality, 'degree_c')
    nx.set_node_attributes(networkGraph, betweenness_centrality, 'betweeness_c')
    nx.set_node_attributes(networkGraph, eigenvector_centrality, 'eigen_c')
    
    graphData['Cluster'] = data_labels

    timeGraphJSON = json_graph.node_link_data(networkGraph)
    with open('ui/json/graph-'+date+'.json', 'w') as f:
        json.dump(timeGraphJSON, f, ensure_ascii=False)
        
    return "Success", 200 

@app.route('/top5', methods=['POST'])
def top5ChangeFeatures():
    date1 = ""
    date2 = ""
    
    if request.method == "POST":
        date1 = request.form["date1"]
        date2 = request.form["date2"]
        diffcount = int(request.form["count"])
    
    networkGraph1 = nx.DiGraph()
    networkGraph2 = nx.DiGraph()
    
    for i in range(len(data)):
        if(data['Time'][i][:10] == date1): 
            networkGraph1.add_edge(data['Source'][i],data['Destination'][i], time = data['Time'][i])
    
    for i in range(len(data)):
        if(data['Time'][i][:10] == date2): 
            networkGraph2.add_edge(data['Source'][i],data['Destination'][i], time = data['Time'][i])
        
    in_degree_g1 = dict(networkGraph1.in_degree)
    out_degree_g1 = dict(networkGraph1.out_degree)
    closeness_centrality_g1 = nx.closeness_centrality(networkGraph1)
    degree_centrality_g1 = nx.degree_centrality(networkGraph1)
    betweenness_centrality_g1 = nx.betweenness_centrality(networkGraph1)
    eigenvector_centrality_g1 = nx.eigenvector_centrality(networkGraph1, max_iter=100000)
    
    in_degree_g2 = dict(networkGraph2.in_degree)
    out_degree_g2 = dict(networkGraph2.out_degree)
    closeness_centrality_g2 = nx.closeness_centrality(networkGraph2)
    degree_centrality_g2 = nx.degree_centrality(networkGraph2)
    betweenness_centrality_g2 = nx.betweenness_centrality(networkGraph2)
    eigenvector_centrality_g2 = nx.eigenvector_centrality(networkGraph2, max_iter=100000)
    

    in_degree_diff = {}
    for node in networkGraph1.nodes:
        if(node in networkGraph2.nodes):
            in_degree_diff[node] = in_degree_g2[node] - in_degree_g1[node]
            
    out_degree_diff = {}
    for node in networkGraph1.nodes:
        if(node in networkGraph2.nodes):
            out_degree_diff[node] = out_degree_g2[node] - out_degree_g1[node]
    
    closeness_centrality_diff = {}
    for node in networkGraph1.nodes:
        if(node in networkGraph2.nodes):
            closeness_centrality_diff[node] = closeness_centrality_g2[node] - closeness_centrality_g1[node]
    
    degree_centrality_diff = {}
    for node in networkGraph1.nodes:
        if(node in networkGraph2.nodes):
            degree_centrality_diff[node] = degree_centrality_g2[node] - degree_centrality_g1[node]
    
    betweenness_centrality_diff = {}
    for node in networkGraph1.nodes:
        if(node in networkGraph2.nodes):
            betweenness_centrality_diff[node] = betweenness_centrality_g2[node] - betweenness_centrality_g1[node]
    
    eigenvector_centrality_diff = {}
    for node in networkGraph1.nodes:
        if(node in networkGraph2.nodes):
            eigenvector_centrality_diff[node] = eigenvector_centrality_g2[node] - eigenvector_centrality_g1[node]
    
    sorted_in_degree = sorted({k: v for k, v in in_degree_diff.items()}.items(), key = 
             lambda kv:(abs(kv[1]), kv[0]), reverse=True)[:diffcount]
    
    sorted_out_degree = sorted({k: v for k, v in out_degree_diff.items()}.items(), key = 
             lambda kv:(abs(kv[1]), kv[0]), reverse=True)[:diffcount]
    
    sorted_closeness_centrality = sorted({k: v for k, v in closeness_centrality_diff.items()}.items(), key = 
             lambda kv:(abs(kv[1]), kv[0]), reverse=True)[:diffcount]
    
    sorted_degree_centrality = sorted({k: v for k, v in degree_centrality_diff.items()}.items(), key = 
             lambda kv:(abs(kv[1]), kv[0]), reverse=True)[:diffcount]
    
    sorted_betweenness_centrality = sorted({k: v for k, v in betweenness_centrality_diff.items()}.items(), key = 
             lambda kv:(abs(kv[1]), kv[0]), reverse=True)[:diffcount]
    
    sorted_eigenvector_centrality = sorted({k: v for k, v in eigenvector_centrality_diff.items()}.items(), key = 
             lambda kv:(abs(kv[1]), kv[0]), reverse=True)[:diffcount]
    
    arr_sorted_indegree=[]
    for k,v in sorted_in_degree:
        dict_single_node = {}
        dict_single_node["name"] = k
        dict_single_node["value"] = v
        arr_sorted_indegree.append(dict_single_node)

    arr_sorted_outdegree=[]
    for k,v in sorted_out_degree:
        dict_single_node = {}
        dict_single_node["name"] = k
        dict_single_node["value"] = v
        arr_sorted_outdegree.append(dict_single_node)

    arr_sorted_closeness_c=[]
    for k,v in sorted_closeness_centrality:
        dict_single_node = {}
        dict_single_node["name"] = k
        dict_single_node["value"] = v
        arr_sorted_closeness_c.append(dict_single_node)

    arr_sorted_betweenness_c=[]
    for k,v in sorted_betweenness_centrality:
        dict_single_node = {}
        dict_single_node["name"] = k
        dict_single_node["value"] = v
        arr_sorted_betweenness_c.append(dict_single_node)

    arr_sorted_degree_c=[]
    for k,v in sorted_degree_centrality:
        dict_single_node = {}
        dict_single_node["name"] = k
        dict_single_node["value"] = v
        arr_sorted_degree_c.append(dict_single_node)

    arr_sorted_eigen_c=[]
    for k,v in sorted_eigenvector_centrality:
        dict_single_node = {}
        dict_single_node["name"] = k
        dict_single_node["value"] = v
        arr_sorted_eigen_c.append(dict_single_node)
    


    result = {"InDegreeDiff":arr_sorted_indegree, 
              "OutDegreeDiff":arr_sorted_outdegree,
              "ClosenessCDiff":arr_sorted_closeness_c,
              "DegreeCDiff":arr_sorted_degree_c,
              "BetweennessCDiff":arr_sorted_betweenness_c,
              "EigenVectorCDiff":arr_sorted_eigen_c}
    
    return jsonify(result)
    

print('\nGo to http://localhost:8000 to see the server\n')
app.run(port=8000)


