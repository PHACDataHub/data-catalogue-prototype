import pandas as pd
import re

def extractCatalogue(xlsx_filepath, approved_datasets_filepath, approved_fields_filepath, extracted_json, extracted_csv):
    """
    Pulls the relevant columns from the data catalogue, 
    changes their headers to something better, 
    then saves as output.json
    which you then must rename to data.json when you're ready to overwrite
    """
    
    # Read the approved datasets list into a DataFrame
    approved_df = pd.read_csv(approved_datasets_filepath, header=None, names=["ID", "Acronym"])
    approved_ids = approved_df["ID"].tolist()
    
    # Read the approved fields list from the CSV file
    approved_fields_df = pd.read_csv(approved_fields_filepath, header=0)
    selected_cols = approved_fields_df.iloc[:, 0].tolist()  # Read column A for original column names
    new_headers = approved_fields_df.iloc[:, 2].tolist()  # Read column C for new headers

    # Read the XLSX into a Pandas DataFrame
    df = pd.read_excel(xlsx_filepath)
    
    # Filter the data to only include approved datasets based on the "ID" column
    df = df[df["ID"].isin(approved_ids)]

    # Ensure that the column exists for all rows
    df["Hyperlinks"] = df["Hyperlinks"].astype(str).fillna("")  # Fill empty cells

    # Helper function to extract the domain name from a URL
    def extract_domain(url):
        match = re.search(r"https?://([^/]+)", url)
        if match:
            return match.group(1)
        else:
            return ""

    # Allowed domains
    allowed_domains = [
        "health-infobase.canada.ca",
        "www.canada.ca",
        "www23.statcan.gc.ca",
        "www150.statcan.gc.ca",
        "jill.hc-sc.gc.ca"
    ]

    # Clean hyperlinks and add descriptive text, filtering by allowed domains
    def clean_hyperlinks(link_str, dataset):
        if pd.isnull(link_str):
            return ""

        links = []
        for link in link_str.replace("\n", ",").split(","): 
            link = link.strip()
            if "https://" in link.lower():
                domain = extract_domain(link)
                if domain in allowed_domains:  # Filter by allowed domains
                    desc_text = f"{dataset} dataset on {domain}"
                    links.append(f'<a href="{link}" target="_blank">{desc_text}</a><br>') 

        return "".join(links)

    # Filter and rename headers BEFORE applying the function
    df_filtered = df[selected_cols]
    df_filtered.columns = new_headers
    
    # Apply hyperlink cleaning function with dataset name to the FILTERED data
    if "Hyperlinks" in df_filtered.columns and "Dataset" in df_filtered.columns:
        df_filtered.loc[:, "Hyperlinks"] = df_filtered.apply(lambda row: clean_hyperlinks(row['Hyperlinks'], row['Dataset']), axis=1)

    # Convert to JSON
    json_data = df_filtered.to_json(orient='records')

    print("writing extracted data to", extracted_json)

    # Save as JSON
    with open(extracted_json, 'w') as f:
        f.write(json_data)

    # Save as CSV
    df_filtered.to_csv(extracted_csv, index=False)  # index=False to avoid adding an index column
    print(f"Writing extracted CSV data to {extracted_csv}")

# file paths
xlsx_filepath = "data/export-en.xlsx" # English input, extracted from the data catalogue
approved_datasets_filepath = "approved-datasets.txt" # important! limits extraction to datasets approved for release
approved_fields_filepath = "approved-fields.csv" # columns to extract and new headers
extracted_json = "data/output.json"
extracted_csv = "data/output.csv"
extractCatalogue(xlsx_filepath, approved_datasets_filepath, approved_fields_filepath, extracted_json, extracted_csv)