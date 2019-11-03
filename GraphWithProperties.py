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


data = pd.read_csv("C:\\Thales_Hackathon\\ia-crime-moreno.csv")

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
    
    graphData['Cluster'] = data_labels

    timeGraphJSON = json_graph.node_link_data(networkGraph)
    with open('ui/json/graph-'+date+'.json', 'w') as f:
        json.dump(timeGraphJSON, f, ensure_ascii=False)
        
    return "Success", 200 
print('\nGo to http://localhost:8000 to see the example\n')
app.run(port=8000)


