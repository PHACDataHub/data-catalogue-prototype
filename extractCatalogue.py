import pandas as pd

def extractCatalogue(csv_filepath, extracted_json):
    """
    This python script is for updating the data catalogue.
    Input a CSV of the data catalogue,
    script pulls the relevant columns from that csv,
    changes their headers to something better, 
    (to add) gets external links from the hyperlinks column
    then saves as output.json, which can be used by the datatables page
    """
    
    # Read the CSV into a Pandas DataFrame
    df = pd.read_csv(csv_filepath)

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
        'When was the Open Government Portal last updated?'
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
        'Last Updated'
    ]



    # filter columns and rename headers 
    df_filtered = df[selected_cols] 
    df_filtered.columns = new_headers

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