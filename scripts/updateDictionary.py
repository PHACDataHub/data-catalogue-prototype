import pandas as pd
import json
import os
import chardet

# Get script directory
script_dir = os.path.dirname(os.path.realpath(__file__))
csv_path = os.path.join(script_dir, '..', 'data', 'dictionary.csv')

# Detect file encoding
with open(csv_path, 'rb') as f:
    result = chardet.detect(f.read())
    encoding = result['encoding']

# Read CSV file with detected encoding
df = pd.read_csv(csv_path, encoding=encoding)

# Print available columns for debugging
print("CSV Columns:", df.columns.tolist())

# Ensure correct column names
french_field_col = "French Plainlanguage"
french_desc_col = "French Description"
english_field_col = "English Plainlanguage"
english_desc_col = "English Description"

# Validate that required columns exist
missing_cols = [col for col in [french_field_col, french_desc_col, english_field_col, english_desc_col] if col not in df.columns]
if missing_cols:
    raise ValueError(f"Missing expected columns in CSV: {missing_cols}")

# Extract relevant columns (Plainlanguage field name and description for each language)
df_french = df[[french_field_col, french_desc_col]].dropna()
df_english = df[[english_field_col, english_desc_col]].dropna()

# Convert to dictionaries
french_dict = df_french.set_index(french_field_col)[french_desc_col].to_dict()
english_dict = df_english.set_index(english_field_col)[english_desc_col].to_dict()

# Define output paths
output_dir = os.path.dirname(csv_path)
french_json_path = os.path.join(output_dir, "dictionary_fr.json")
english_json_path = os.path.join(output_dir, "dictionary_en.json")

# Save to JSON
with open(french_json_path, "w", encoding="utf-8") as f:
    json.dump(french_dict, f, indent=4, ensure_ascii=False)

with open(english_json_path, "w", encoding="utf-8") as f:
    json.dump(english_dict, f, indent=4, ensure_ascii=False)

print(f"French JSON saved at: {french_json_path}")
print(f"English JSON saved at: {english_json_path}")
