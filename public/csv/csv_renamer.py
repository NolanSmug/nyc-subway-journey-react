import os

# Get the current working directory
directory = "csv"

# List all files in the directory
files = os.listdir(directory)

# Iterate through each file
for filename in files:
    # Check if the file name starts with an uppercase letter
    if filename[0].isupper():
        # De-capitalize the file name
        new_filename = filename.lower()
        # Construct the full paths for the original and new file names
        original_path = os.path.join(directory, filename)
        new_path = os.path.join(directory, new_filename)
        # Rename the file
        os.rename(original_path, new_path)
        print(f"Renamed {filename} to {new_filename}")
    else:
        print(f"{filename} is already in its valid pattern!")