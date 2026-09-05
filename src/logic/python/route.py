"""
Nolan Cyr

This is an live FastAPI service I wrote for OptimalRoute.tsx. It is NOT being hosted in this repo, this is just a copy of the code.

    Breadth-First Search and heuristic algorithms to find the shortest path between two given NYC subway stations.
    Creates a graph representation of the network, runs algorithm with input being two station ids (IDs can be found in ./game-data.csv) and heuristic boolean.
    Returns the path as a list of station names in dictionary/JSON format
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import json
import heapq
import networkx as nx

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
with open("./station_data.json", "r", encoding="utf-8") as f:
    SUBWAY_DATA = json.load(f)

station_id_to_name_map = {}
for stations in SUBWAY_DATA.values():
    for s in stations:
        station_id_to_name_map[s["id"]] = s["name"]


# ------------------ HELPERS ------------------
def station_id_to_name(id):
    return station_id_to_name_map.get(id)


def get_all_ids():
    return list(station_id_to_name_map.keys())


def line_to_line_color(line):
    return LINE_COLOR_DICT.get(line, "#00000000")


def lexicographically_order_lines(lines: list):
    ordering = list(LINE_COLOR_DICT.keys())  # this dict has the proper ordering too
    indices = []

    for line in lines:
        try:
            indices.append(ordering.index(line))
        except ValueError:
            indices.append(0)
            print(f"could not find line: {line} in LEX_ORDERING list")

    result = [line for _, line in sorted(zip(indices, lines))]  # map each line to its index in LEX_ORDERING

    if len(indices) == len(lines):
        return result
    else:
        return lines


def clean_a_train_lines(lines):
    cleaned = []
    for line in lines:
        if line.startswith("A_Train"):
            base = "A_Train"
        else:
            base = line

        if base not in cleaned:
            cleaned.append(base)

    return cleaned


# ------------------ LOGIC ------------------
def create_subway_map_graph(data):
    subway_graph = nx.Graph()

    for line_name, stations in data.items():
        for i in range(len(stations)):
            curr = stations[i]

            subway_graph.add_node(curr["id"], name=curr["name"])

            # Connect to the next station
            if i < len(stations) - 1:
                next = stations[i + 1]
                u, v = curr["id"], next["id"]

                if subway_graph.has_edge(u, v):
                    if line_name not in subway_graph[u][v]["lines"]:
                        subway_graph[u][v]["lines"].append(line_name)
                else:
                    subway_graph.add_edge(u, v, lines=[line_name])

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


def bfs_heuristic_path(graph, start_id, dest_id):
    if start_id not in graph or dest_id not in graph:
        return []

    # Queue tuples: (effort, current_node, path, active_lines)
    queue = [(0, start_id, [start_id], None)]
    min_effort_to_next = {(start_id, None): 0}

    while queue:
        current_effort, current_node, path, active_lines = heapq.heappop(queue)
        current_state = (current_node, active_lines)

        # If we already found a better way to this exact state, ignore this path.
        if current_effort > min_effort_to_next.get(current_state, 2**31):
            continue

        if current_node == dest_id:
            return path  # path found!

        for neighbor in graph[current_node]:
            edge_lines = graph[current_node][neighbor]["lines"]
            step_effort = 1  # default effort
            next_active_lines = tuple(edge_lines)

            if active_lines is not None:
                shared_lines = tuple(set(active_lines).intersection(set(edge_lines)))

                if not shared_lines:
                    step_effort += 5  # transfer costs extra 5 effort
                else:
                    next_active_lines = shared_lines

            total_effort = current_effort + step_effort
            current_state = (neighbor, next_active_lines)

            # If this is the lowest effort way to reach this neighbor, visit it
            if current_state not in min_effort_to_next or total_effort < min_effort_to_next[current_state]:
                min_effort_to_next[current_state] = total_effort
                heapq.heappush(queue, (total_effort, neighbor, path + [neighbor], next_active_lines))

    return []


def get_lines_from_path(graph: nx.Graph, path: list):
    """
    A greedy search to ensure that we don't grab "optional" lines in the route that technically don't serve a benefit.
    ex: going from Fort Hamilton Pkwy (F)(G) to Avenue I (F) should NOT show (G) on edges between, despite the fact that you can technically take the (G) to Church Av (F)(G)
    """
    if not path or len(path) == 1:
        return [["Null_Train"]]

    raw_edges = []
    for stop in range(len(path) - 1):
        raw_edges.append(graph.get_edge_data(path[stop], path[stop + 1])["lines"])

    lines_used = []
    i = 0

    while i < len(raw_edges):
        shared_lines = set(raw_edges[i])
        j = i + 1

        while j < len(raw_edges):
            next_shared_lines = shared_lines.intersection(set(raw_edges[j]))
            if not next_shared_lines:
                break  # need to transfer

            shared_lines = next_shared_lines
            j += 1

        best_lines = lexicographically_order_lines(list(shared_lines))

        for _ in range(i, j):
            lines_used.append(best_lines)

        i = j

    lines_used.append(["Null_Train"])

    return lines_used


app = FastAPI(title="Nolan's subway route algorithm")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://nolansmug.github.io", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

G = create_subway_map_graph(SUBWAY_DATA)  # build graph


# just to keep the server alive when necessary
@app.get("/ping")
def ping():
    return {"status": "ok"}


@app.get("/")
def read_root():
    return {"Hello": "world!"}


@app.get("/ids")
def get_ids():
    return [
        {
            "id": id,
            "name": station_id_to_name(id),
        }
        for id in get_all_ids()
    ]


@app.get("/route/{start_id}/{dest_id}/{heuristic}")
def get_optimal_route(start_id: str, dest_id: str, heuristic: bool = False):
    if start_id not in G or dest_id not in G:
        return {"error": "Invalid station ID"}

    if start_id == dest_id:
        return {"error": "Start and destination cannot be the same"}

    print(f"\n\n---- requesting {'heuristic' if heuristic else 'shortest'} route from {start_id} to {dest_id} ----\n")

    path_ids = []
    if heuristic:
        path_ids = bfs_heuristic_path(G, start_id, dest_id)
    else:
        path_ids = bfs_shortest_path(G, start_id, dest_id)

    path_names = [station_id_to_name(id) for id in path_ids]
    lines_used = get_lines_from_path(G, path_ids)

    line_colors = [line_to_line_color(line[0]) for line in lines_used]

    path_stations = [
        {"id": id, "name": name, "lines": clean_a_train_lines(line), "line": line, "color": color}
        for id, name, line, color in zip(path_ids, path_names, lines_used, line_colors)
    ]

    print(path_stations)
    return path_stations


if __name__ == "__main__":
    start_id = "A02"
    dest_id = "JAY"

    print(f"\n---- TEST route from {start_id} to {dest_id} ----\n")
    path_ids = bfs_shortest_path(G, start_id, dest_id)
    path_names = [station_id_to_name(id) for id in path_ids]
    lines_used = get_lines_from_path(G, path_ids)
    path_stations = [{"id": id, "name": name, "line": line} for id, name, line in zip(path_ids, path_names, lines_used)]

    path_ids_heu = bfs_heuristic_path(G, start_id, dest_id)
    path_names_heu = [station_id_to_name(id) for id in path_ids_heu]
    lines_used_heu = get_lines_from_path(G, path_ids_heu)
    path_stations_heu = [
        {"id": id, "name": name, "line": line} for id, name, line in zip(path_ids_heu, path_names_heu, lines_used_heu)
    ]

    print(f"\n\nshortest path\n")
    print(path_stations)

    print(f"\n\nheuristic path\n")
    print(path_stations_heu)

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
