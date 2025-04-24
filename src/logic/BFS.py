"""
Nolan Cyr

Breadth First Search algorithm to find the shortest path between two given NYC subway stations
    creates a graph representation of the network from included csv files
    runs BFS algorithm to find the shortest path with input being two station ids (IDs can be found in ./data/game-data.csv)
    returns the path as a list of station names in JSON format
    
This is an API service I wrote for OptimalRoute.tsx
"""

import pandas as pd
import networkx as nx
from flask import Flask, request, jsonify
import os
import json

def create_simple_subway_graph(stations_file, csv_dir):
    subway_graph = nx.Graph()

    # Load station data (ids and names)
    stations_df = pd.read_csv(stations_file)
    for i in range(len(stations_df)):
        stop_id = stations_df.iloc[i]["stop_id"]
        stop_name = stations_df.iloc[i]["stop_name"]
        subway_graph.add_node(stop_id, name=stop_name)

    # Get all line csvs
    line_csvs = []
    for csv in os.listdir(csv_dir):
        if csv.endswith("_train_stations.csv"):
            line_csvs.append(csv)

    # For each line's csv, connect stations with an edge
    for csv in line_csvs:
        stations = pd.read_csv(csv_dir + csv)
        station_ids = stations["stop_id"].tolist()

        for i in range(len(station_ids) - 1):
            node1 = station_ids[i]
            node2 = station_ids[i + 1]
            line_name = csv.split("_")[0] # get the line name for the edge creation
            
            line_name = line_to_line_color(line_name)

            if subway_graph.has_edge(node1, node2):
                subway_graph[node1][node2]['lines'].append(line_name) # if edge exists, append to the edge's lines list
            else:
                subway_graph.add_edge(node1, node2, lines=[line_name]) # else, create edge with initialized lines list

    print(f"\n{subway_graph} generated\n\n")

    return subway_graph


def bfs_shortest_path(graph, start_id, dest_id):
    if start_id not in graph or dest_id not in graph:
        return []

    visited = {start_id}
    queue = [[start_id]] # path queue

    while queue:
        current_path = queue.pop(0)
        current_node = current_path[-1] # tail of path

        if current_node == dest_id:
            return current_path # path found!

        for neighbor in graph[current_node]:
            if neighbor not in visited:
                visited.add(neighbor)

                updated_path = current_path + [neighbor] # update current path
                queue.append(updated_path)

    return []

def get_lines_from_path(graph: nx.Graph, path: list):
    lines_used = []

    for stop in range(len(path) - 1):
        lines_on_edge = graph.get_edge_data(path[stop], path[stop + 1])["lines"]

        if stop > 0 and lines_used[-1] in lines_on_edge:
            lines_used.append(line_to_line_color(lines_used[-1]))
        else:
            lines_used.append(line_to_line_color(lines_used[0]))

    print(lines_used)
    return lines_used
        


# HELPERS
def station_id_to_name(graph, id):
    return graph.nodes[id]["name"]

def line_to_line_color(line):
    line = line.lower()
    dict = {"one": "#EE352E", "two": "#EE352E", "three": "#EE352E", "four": "#00933C", "five": "#00933C", "six": "#00933C", "seven": "#B933AD", "a": "#0039A6", "c":"#0039A6", "e":"#0039A6","b":"#FF6319","d":"#FF6319","f":"#FF6319","m":"#FF6319","n":"#FCCC0A","q":"#FCCC0A", "r":"#FCCC0A", "w":"#FCCC0A", "j":"#996633", "z":"#996633","g":"#6CBE45", "l":"#A7A9AC", "s":"#"}
    return dict[line]



app = Flask(__name__)
graph = create_simple_subway_graph("src/logic/data/game-data.csv", "public/csv/")

@app.route('/get-route', methods=['POST'])
def get_route():
    data = request.json
    start_id = data.get("start_id")
    dest_id = data.get("dest_id")

    if start_id not in graph or dest_id not in graph:
        return jsonify({"error": "Invalid station ID"}), 400

    path_ids = bfs_shortest_path(graph, start_id, dest_id)
    path_names = [station_id_to_name(graph, id) for id in path_ids]
    lines_used = get_lines_from_path(graph, path_ids)

    return jsonify({"path": path_names, "lines": lines_used})

if __name__ == '__main__':
    app.run(debug=True)