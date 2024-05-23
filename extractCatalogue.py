import pandas as pd
import re

def extractCatalogue(csv_filepath, extracted_json):
    """
    Pulls the relevant columns from the data catalogue, 
    changes their headers to something better, 
    then saves as output.json
    which you then must rename to data.json when you're ready to overwrite
    """
    
    # Read the CSV into a Pandas DataFrame
    df = pd.read_csv(csv_filepath)
    
    # Ensure that the column exists for all rows
    df["Hyperlinks"] = df["Hyperlinks"].astype(str).fillna("")  # Fill empty cells

    # Columns to extract, these must be the exact name of the column you want to extract from the catalogue
    selected_cols = [
        'Database/Dataset/System Name (English)',
        'Acronym (English)',
        'Description (English)',
        'Keywords',
        'Objective(s) (English)',
        'Geographical Coverage',
        'Data Quality Checks or Assessments',
        'Frequency of Data Collection',
        'Data sources',
        'Open government status',
        'Programming Language',
        'Years/Cycle Available',
        'Availability of Indigenous Variables/Data',
        'Availability of Sex and Gender-based Analysis Plus (SGBA+) Data',
        'Access Requirement',
        'Data is Accessible to ',
        'Intended Audience of Data Knowledge Translation Products and Publications',
        'General Purpose Category',
        'When was the Open Government Portal last updated?',
        'Hyperlinks'
    ]

    # New, shorter headers
    new_headers = [
        'Dataset',
        'Acronym',
        'Description',
        'Keywords',
        'Objectives',
        'Coverage',
        'Quality Checks',
        'Frequency',
        'Sources',
        'Open Status',
        'Programming Language',
        'Years Available',
        'Indigenous Data',
        'SGBA+ Data',
        'Access',
        'Accessible To',
        'Audience',
        'Category',
        'Last Updated',
        'Hyperlinks'
    ]

    # Helper function to extract the domain name from a URL
    def extract_domain(url):
        match = re.search(r"https?://([^/]+)", url)
        if match:
            return match.group(1)
        else:
            return ""

    # Clean hyperlinks and add descriptive text
    def clean_hyperlinks(link_str, dataset):
        if pd.isnull(link_str):
            return ""

        links = []
        for link in link_str.replace("\n", ",").split(","):  # Still handle newlines
            link = link.strip()
            if "https://" in link.lower():
                domain = extract_domain(link)
                desc_text = f"{dataset} dataset on {domain}"
                links.append(f'<a href="{link}" target="_blank">{desc_text}</a><br>') # Add <br> for line breaks

        return "".join(links)  # Join with empty string (no commas)

    # Filter and rename headers BEFORE applying the function
    df_filtered = df[selected_cols]
    df_filtered.columns = new_headers
    
    # Apply hyperlink cleaning function with dataset name to the FILTERED data
    df_filtered.loc[:, "Hyperlinks"] = df_filtered.apply(lambda row: clean_hyperlinks(row['Hyperlinks'], row['Dataset']), axis=1)

    # Convert to JSON
    json_data = df_filtered.to_json(orient='records')

    print("writing extracted data to", extracted_json)

    # Save as JSON
    with open(extracted_json, 'w') as f:
        f.write(json_data)

# file paths
csv_filepath = "data-catalogue.csv"
extracted_json = "output.json"  
extractCatalogue(csv_filepath, extracted_json)
