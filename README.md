# What the project does
Takes extracted data from the PHAC Data Catalogue and presents them as a dynamic table for the public to explore.

# Why the project is useful
Gives the public a way to explore and understand all the data holdings at PHAC.

# How it works
A python script runs locally and extracts the relevant data from the exports from the internal PHAC Data Catalogue. This gets pushed to GitHub. The web page, hosted by GitHub Pages, then presents this data using the [datatables library](https://datatables.net/).


# Who maintains and contributes to the project

This project is run by the Data Transparency team at PHAC. The data are pulled from the internal PHAC Data Catalogue, which is maintained by the DAAM team at DMIA.

# Updating the PHAC Data Catalogue (aka the public metadata viewer)

### download the data catalogue extracts
- go to the internal [Data Catalogue](https://jill.hc-sc.gc.ca/confluence/display/DCAP/Data+Catalogue)
- download the english export, rename it `export-en.xlsx`
- download the french export, rename it `export-fr.xlsx`
- put both files in the `put data catalogue extracts here` folder
### extract and update the data
Note that this will overwrite the current output data files, however the older one's will still be available if you checkout older commits of the github repository.
- run `python scripts/extractCatalogue.py` in the root folder.
- this will pull the relevant 
- caution: ensure that the full data catalogue extract files aren't accidentally pushed to the github repo. this shouldn't be an issue so long as they are only placed in the `put data catalogue extracts here` folder, as it is added to the `.gitignore` file. If they somehow get pushed, make sure to remove that commit asap as possible
- Push to github

# Updating the data dictionary
The data dictionary file is located at `data/dictionary.csv`. This is the file you will update to update the data dictionary. Ensure that it is saved as a csv with UTF-8 encoding. Make sure to maintain the current csv structure, as this file serves several important functions:
	- it lists the approved fields that will be extracted by extractCatalogue.py
	- it marks which fields will be displayed by default when users load the data catalogue
	- it is the data dictionary that is displayed on the data dictionary page

# Updating the web pages
The French/English text content for each page is loaded dynamically from a javascript file. So to udpate the content.