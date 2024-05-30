# What the project does

Takes data from the PHAC Data Catalogue and presents them as a dynamic table for the public to explore.

# Why the project is useful

Gives the public a way to explore and understand all the data holdings at PHAC

# How it works

1. Put a copy of the data catalogue as a CSV in the root folder, saved as "data-catalogue.csv"
2. run extractCatalogue.py using Python, which will create output.json
3. rename the output.json to data.json when you're ready to overwrite the previous data.

## extractCatalogue.py

This python script reads data-catalogue.csv and extracts the following columns of data (exact names of the headers in the catalogue):

- Database/Dataset/System Name (English)
- Acronym (English)
- Description (English)
- Keywords
- Objective(s) (English)
- Geographical Coverage
- Data Quality Checks or Assessments
- Frequency of Data Collection
- Data sources
- Open government status
- Programming Language
- Years/Cycle Available
- Availability of Indigenous Variables/Data
- Availability of Sex and Gender-based Analysis Plus (SGBA+) Data
- Access Requirement
- Data is Accessible to
- Intended Audience of Data Knowledge Translation Products and Publications
- General Purpose Category
- When was the Open Government Portal last updated?
- Hyperlinks

The headers are then changed to plain language:

- Dataset
- Acronym
- Description
- Keywords
- Objectives
- Coverage
- Quality Checks
- Frequency
- Sources
- Open Status
- Programming Language
- Years Available
- Indigenous Data
- SGBA+ Data
- Access
- Accessible To
- Audience
- Category
- Last Updated
- Hyperlinks

The script excludes hyperlinks that don't have "http", which should exclude any internal links.

The script then converts these data to a JSON file and exports it to output.json.

## display the data with datatables

When you're ready to update the data catalogue viewer, you can rename output.json to data.json, overwriting the previous catalogue.
And that's all you need to do. Whenever someone goes to index.html in their browser it will use DataTables to build a dynamic and searchable table of the data catalogue.

# Who maintains and contributes to the project

This project is run by the Data Transparency team at PHAC