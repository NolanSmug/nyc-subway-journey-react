"""
Nolan Cyr

This is an live FastAPI service I wrote for OptimalRoute.tsx. It is NOT being hosted in this repo, this is just a copy of the code.

Breadth First Search algorithm to find the shortest path between two given NYC subway stations
    creates a graph representation of the network
    runs BFS algorithm to find the shortest path with input being two station ids (IDs can be found in ./data/game-data.csv)
    returns the path as a list of station names in dictionary/JSON format
"""

import csv
import os
import networkx as nx

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


LINE_COLOR_DICT = {
    "One_Train": "#EE352E",
    "Two_Train": "#EE352E",
    "Three_Train": "#EE352E",
    "Four_Train": "#00933C",
    "Five_Train": "#00933C",
    "Six_Train": "#00933C",
    "Seven_Train": "#B933AD",
    "A_Train": "#0039A6",
    "C_Train": "#0039A6",
    "A_Train_Rockaway-Mott": "#0039A6",
    "A_Train_Lefferts": "#0039A6",
    "E_Train": "#0039A6",
    "B_Train": "#FF6319",
    "D_Train": "#FF6319",
    "F_Train": "#FF6319",
    "M_Train": "#FF6319",
    "N_Train": "#FCCC0A",
    "Q_Train": "#FCCC0A",
    "R_Train": "#FCCC0A",
    "W_Train": "#FCCC0A",
    "J_Train": "#996633",
    "Z_Train": "#996633",
    "G_Train": "#6CBE45",
    "L_Train": "#A7A9AC",
    "S_Train": "#808183",
    "S_Train_Shuttle": "#808183",
    "S_Train_Rockaway": "#808183",
    "Null_Train": "#00000000",
}

# --------------- DATA LOADING ---------------
station_id_to_name_map = {}
with open("./all_stations.csv", mode="r", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    for row in reader:
        station_id_to_name_map[row["stop_id"]] = row["stop_name"]


# ------------------ HELPERS ------------------
def station_id_to_name(id_):
    return station_id_to_name_map.get(id_)


def get_all_ids():
    return list(station_id_to_name_map.keys())


def get_line_name_from_csv_name(csv):
    line = csv.split("_")[0].capitalize()  # get the line character
    is_special_line = csv.split("_")[2] != "stations.csv"

    # special lines: s_train_rockaway_stations, s_train_shuttle_stations
    if is_special_line:
        match csv.split("_")[2]:
            case "rockaway":
                return f"{line}_Train_Rockaway"
            case "shuttle":
                return f"{line}_Train_Shuttle"
            case _:
                return f"{line}_Train"

    return f"{line}_Train"


def line_to_line_color(line):
    if line is None:
        return "#00000000"

    return LINE_COLOR_DICT[line]


def lexicographically_order_lines(lines: list):
    ordering = list(LINE_COLOR_DICT.keys())  # this dict has the proper ordering too
    indexes = []

    for line in lines:
        try:
            indexes.append(ordering.index(line))
        except ValueError:
            indexes.append(0)
            print(f"could not find line: {line} in LEX_ORDERING list")

    result = [line for _, line in sorted(zip(indexes, lines))]  # map each line to its index in LEX_ORDERING

    if len(indexes) == len(lines):
        return result
    else:
        return lines


# ------------------ LOGIC ------------------
def create_simple_subway_graph(stations_file, csv_dir):
    subway_graph = nx.Graph()

    # Load station data (ids and names)
    with open(stations_file, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            subway_graph.add_node(row["stop_id"], name=row["stop_name"])

    # Get all line csvs
    line_csvs = []
    for csv_file in os.listdir(csv_dir):
        if csv_file.endswith("_stations.csv"):
            line_csvs.append(csv_file)

    # For each line's csv, connect stations with an edge
    for csv_file in line_csvs:
        station_ids = []
        with open(os.path.join(csv_dir, csv_file), mode="r", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            for row in reader:
                station_ids.append(row["stop_id"])

        for i in range(len(station_ids) - 1):
            node1 = station_ids[i]
            node2 = station_ids[i + 1]

            line_name = get_line_name_from_csv_name(csv_file)  # get the LineName from the csv filename

            if subway_graph.has_edge(node1, node2):
                edge_lines = subway_graph[node1][node2]["lines"]

                if line_name not in edge_lines:
                    edge_lines.append(line_name)  # if edge exists, append to the edge's lines list
            else:
                subway_graph.add_edge(node1, node2, lines=[line_name])  # else, create edge with initialized lines list

    print(f"\n{subway_graph} generated\n\n")

    return subway_graph


def bfs_shortest_path(graph, start_id, dest_id):
    if start_id not in graph or dest_id not in graph:
        return []

    visited = {start_id}
    queue = [[start_id]]  # path queue

    while queue:
        current_path = queue.pop(0)
        current_node = current_path[-1]  # tail of path

        if current_node == dest_id:
            return current_path  # path found!

        for neighbor in graph[current_node]:
            if neighbor not in visited:
                visited.add(neighbor)

                updated_path = current_path + [neighbor]  # update current path
                queue.append(updated_path)

    return []


def get_lines_from_path(graph: nx.Graph, path: list):
    lines_used = []

    for stop in range(len(path) - 1):
        lines_on_edge = graph.get_edge_data(path[stop], path[stop + 1])[
            "lines"
        ]  # get the lines on the edge ahead of us
        lines_on_edge = lexicographically_order_lines(lines_on_edge)  # order lines properly (ex: NWQR -> NQRW)

        if len(lines_used) > 0:
            current_line = lines_used[-1]

        if stop > 0 and current_line in lines_on_edge:
            if len(lines_on_edge) > 1:
                lines_used.append(lines_on_edge)
            else:
                lines_used.append(current_line)  # select the same line as the prev
        else:
            lines_used.append(lines_on_edge)  # select the first line on edge (for now)

    lines_used.append(["Null_Train"])  # Add Null_Train at end (no line after destination)

    return lines_used


# ------------------ API ------------------
app = FastAPI(title="Nolan's subway route algorithm")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://nolansmug.github.io", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graph = create_simple_subway_graph("./game-data.csv", "./csv/")  # build graph


# just to keep the server alive when necessary
@app.get("/ping")
def ping():
    return {"status": "ok"}


@app.get("/")
def read_root():
    return {"Hello": "world!"}


@app.get("/ids")
def read_ids():
    return [
        {
            "id": id,
            "name": station_id_to_name(id),
        }
        for id in get_all_ids()
    ]


@app.get("/route/{start_id}/{dest_id}")
def read_route(start_id: str, dest_id: str):
    if start_id not in graph or dest_id not in graph:
        return {"error": "Invalid station ID"}

    if start_id == dest_id:
        return {"error": "Start and destination cannot be the same"}

    print(f"\n\n---- requesting route from {start_id} to {dest_id} ----\n")
    path_ids = bfs_shortest_path(graph, start_id, dest_id)
    path_names = [station_id_to_name(id) for id in path_ids]
    lines_used = get_lines_from_path(graph, path_ids)
    line_colors = [line_to_line_color(line[0]) for line in lines_used]

    path_stations = [
        {"id": id, "name": name, "lines": line, "color": color}
        for id, name, line, color in zip(path_ids, path_names, lines_used, line_colors)
    ]

    # print(path_stations)
    return path_stations


# ------------------ TESTING ------------------
if __name__ == "__main__":
    START_ID = "A02"
    DEST_ID = "JAY"

    print(f"\n\n---- requesting route from {START_ID} to {DEST_ID} ----\n")
    path_ids = bfs_shortest_path(graph, START_ID, DEST_ID)
    path_names = [station_id_to_name(id) for id in path_ids]
    lines_used = get_lines_from_path(graph, path_ids)

    path_stations = [{"id": id, "name": name, "line": line} for id, name, line in zip(path_ids, path_names, lines_used)]

    print(path_stations)
