import os
import pandas as pd
import re

def extractCatalogue(
    xlsx_filepath, 
    approved_datasets_filepath, 
    approved_fields_filepath, 
    extracted_json, 
    extracted_csv, 
    language='en'
):
    """
    Pulls columns from the data catalogue, based on which columns are 
    listed in 'data/dictionary.csv'. Changes their headers to plain 
    language, then saves as output.json (UTF-8) which you then must rename 
    to data.json when you're ready to overwrite. Supports English ('en') 
    and French ('fr') versions of the data.
    """
    # Read the approved datasets list into a DataFrame with UTF-8 encoding
    approved_df = pd.read_csv(approved_datasets_filepath, header=None, names=["ID", "Acronym"], encoding='utf-8')
    approved_ids = approved_df["ID"].tolist()
    
    # Read the approved fields list from the CSV file with UTF-8 encoding
    approved_fields_df = pd.read_csv(approved_fields_filepath, header=0, encoding='utf-8')

    # Select columns and headers based on the language
    if language == 'en':
        # Column A for original English col names; Column C for new English headers
        selected_cols = approved_fields_df.iloc[:, 0].dropna().tolist()
        new_headers = approved_fields_df.iloc[:, 2].dropna().tolist()
    elif language == 'fr':
        # Column B for original French col names; Column D for new French headers
        selected_cols = approved_fields_df.iloc[:, 1].dropna().tolist()
        new_headers = approved_fields_df.iloc[:, 3].dropna().tolist()

    # Read the XLSX into a Pandas DataFrame
    df = pd.read_excel(xlsx_filepath)
    
    # Filter the data to only include approved datasets (by ID)
    if "ID" in df.columns:
        df = df[df["ID"].isin(approved_ids)]

    # Clean up various formatting issues in all cells
    def clean_cell_value(cell_value):
        if isinstance(cell_value, str):
            # Replace line breaks and XML encoded versions with <br>, 
            # ensuring only one <br> in a row
            cleaned_value = re.sub(r'(\r\n|\n|\r|_x000d_|_x000a_)+', '<br>', cell_value)
            
            # Replace bullet points (•, ▪, etc.) with "- "
            cleaned_value = re.sub(r'[•▪]', '- ', cleaned_value)

            # Remove leading/trailing whitespace and reduce multiple spaces
            cleaned_value = re.sub(r'\s+', ' ', cleaned_value).strip()

            # Ensure no multiple <br> in a row
            cleaned_value = re.sub(r'(<br>)+', '<br>', cleaned_value)

            return cleaned_value
        return cell_value

    # Apply the cleaning function to all columns
    df = df.apply(lambda col: col.map(clean_cell_value) if col.dtype == "object" else col)

    # Filter and rename headers
    df_filtered = df[selected_cols]
    df_filtered.columns = new_headers
    
    # Convert to JSON with UTF-8 encoding
    json_data = df_filtered.to_json(orient='records', force_ascii=False)
    print(f"Writing extracted data to {extracted_json}")

    with open(extracted_json, 'w', encoding='utf-8') as f:
        f.write(json_data)

    # Save as CSV with BOM to ensure Excel reads special characters
    df_filtered.to_csv(extracted_csv, index=False, encoding='utf-8-sig')
    print(f"Writing extracted CSV data to {extracted_csv}")


# --------------------------------------------------
# Use path-joining so everything is relative to this script's location
script_dir = os.path.dirname(os.path.realpath(__file__))

# English version
xlsx_filepath_en = os.path.join(script_dir, '..', 'put data catalogue extracts here', 'export-en.xlsx')
extracted_json_en = os.path.join(script_dir, '..', 'data', 'output-en.json')
extracted_csv_en  = os.path.join(script_dir, '..', 'data', 'output-en.csv')
approved_datasets_filepath = os.path.join(script_dir, '..', 'approved-datasets.txt')
approved_fields_filepath   = os.path.join(script_dir, '..', 'data', 'dictionary.csv')

extractCatalogue(
    xlsx_filepath_en,
    approved_datasets_filepath,
    approved_fields_filepath,
    extracted_json_en,
    extracted_csv_en,
    language='en'
)

# French version
xlsx_filepath_fr = os.path.join(script_dir, '..', 'put data catalogue extracts here', 'export-fr.xlsx')
extracted_json_fr = os.path.join(script_dir, '..', 'data', 'output-fr.json')
extracted_csv_fr  = os.path.join(script_dir, '..', 'data', 'output-fr.csv')

extractCatalogue(
    xlsx_filepath_fr,
    approved_datasets_filepath,
    approved_fields_filepath,
    extracted_json_fr,
    extracted_csv_fr,
    language='fr'
)
