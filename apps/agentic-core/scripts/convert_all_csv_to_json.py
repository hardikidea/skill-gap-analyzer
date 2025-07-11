import os
import csv
import json
import sys

# 🔥 Fix field size issue
csv.field_size_limit(sys.maxsize)

INPUT_DIR = os.path.join(os.path.dirname(__file__), '../esco/v1/csv')
OUTPUT_DIR = os.path.join(INPUT_DIR, 'json')

os.makedirs(OUTPUT_DIR, exist_ok=True)

csv_files = [f for f in os.listdir(INPUT_DIR) if f.endswith('.csv')]

for csv_file in csv_files:
    csv_path = os.path.join(INPUT_DIR, csv_file)
    json_filename = os.path.splitext(csv_file)[0] + '.json'
    json_path = os.path.join(OUTPUT_DIR, json_filename)

    with open(csv_path, encoding='utf-8') as f_in, open(json_path, 'w', encoding='utf-8') as f_out:
        reader = csv.DictReader(f_in)
        rows = [row for row in reader]
        json.dump(rows, f_out, indent=2, ensure_ascii=False)
        print(f"✅ Converted {csv_file} → {json_filename}")
