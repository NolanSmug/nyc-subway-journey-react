import csv
import json
import glob
import os

BOROUGH_MAP = { 'bk': 'Brooklyn', 'm': 'Manhattan', 'q': 'Queens', 'bx': 'Bronx', 'si': 'Staten Island' }
STRING_TO_LINE = {
    '1': 'One_Train', '2': 'Two_Train', '3': 'Three_Train', 
    '4': 'Four_Train', '5': 'Five_Train', '6': 'Six_Train', '7': 'Seven_Train', 
    'A': 'A_Train', 'Al': 'A_Train_Lefferts', 'Ar': 'A_Train_Rockaway-Mott', 
    'B': 'B_Train', 'C': 'C_Train', 'D': 'D_Train', 'E': 'E_Train',
    'F': 'F_Train', 'M': 'M_Train', 
    'N': 'N_Train', 'Q': 'Q_Train', 'R': 'R_Train', 'W': 'W_Train',
    'J': 'J_Train', 'Z': 'Z_Train', 'G': 'G_Train', 'L': 'L_Train', 
    'S': 'S_Train', 'Sf': 'S_Train_Shuttle', 'Sr': 'S_Train_Rockaway'
}

def convert_to_json():
    subway_data = {}
    
    for filepath in glob.glob('../../../public/csv/*_stations.csv'):
        filename = os.path.basename(filepath)
        if filename == 'all_stations.csv': 
            continue
            
        line_key = filename.replace('_stations.csv', '').capitalize()
        
        stations = []
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader, None)
            
            for row in reader:
                if len(row) < 4: continue
                
                raw_transfers = [row[2].strip().split() if row[2].strip() else []]
                transfers = [STRING_TO_LINE.get(t, 'Null_Train') for t in raw_transfers]
                borough = BOROUGH_MAP.get(row[3].strip().lower(), 'Staten Island')
                
                stations.append({
                    "id": row[0].strip(),
                    "name": row[1].strip(),
                    "transfers": transfers,
                    "borough": borough
                })
        
        subway_data[line_key] = stations

    with open('../../../public/csv/subway_data.json', 'w', encoding='utf-8') as out:
        json.dump(subway_data, out, separators=(',', ':'))
        print("created subway_data.json successfully")

if __name__ == '__main__':
    convert_to_json()