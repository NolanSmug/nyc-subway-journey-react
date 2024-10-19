import os
import csv

# DO NOT TOUCH OR RUN
#
#
#
#

# Function to reverse CSV file contents
def reverse_csv_file(file_path):
    with open(file_path, 'r', newline='') as csvfile:
        reader = csv.reader(csvfile)
        data = list(reader)

    with open(file_path, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerows(reversed(data))

csv_files = [file for file in os.listdir() if file.endswith('csv')]

# Pattern of files to reverse
pattern = [
    # 'b_train_stations.csv', 'm_train_stations.csv', 'n_train_stations.csv'
]

# Filter out files following the specified pattern
target_files = [file for file in csv_files if file.lower() in pattern]

# Reverse contents of each target file
for file in target_files:
    reverse_csv_file(file)
    print(f"Reversed contents of {file}")

print("All target CSV files reversed successfully.")
