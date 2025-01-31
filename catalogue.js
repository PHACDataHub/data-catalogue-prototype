document.addEventListener('DOMContentLoaded', async function () {
    // Get the 'lang' query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    let language = urlParams.get('lang') || localStorage.getItem('language') || navigator.language.split('-')[0];

    // Set language to English if it's not explicitly set to French or English
    if (!['en', 'fr'].includes(language)) language = 'en';
    localStorage.setItem('language', language);
    document.documentElement.lang = language;

    // Select the gcds-header element and update the language switch link
    const header = document.querySelector('gcds-header');
    if (header) {
        header.setAttribute('lang-code', language === 'en' ? 'fr' : 'en');
        header.setAttribute('lang-href', `${window.location.pathname}?lang=${language === 'en' ? 'fr' : 'en'}`);
    }

    // Translations for static text
    const translations = {
        en: {
            pageTitle: 'Public Health Data Catalogue',
            introText: "Explore the Public Health Agency of Canada's Data Catalogue",
            lastUpdatedLabel: 'Last updated',
            breadcrumbsHTML: `
            <gcds-breadcrumbs>
                <gcds-breadcrumbs-item href="https://www.canada.ca/en/services/health.html">Health</gcds-breadcrumbs-item>
                <gcds-breadcrumbs-item href="https://www.canada.ca/en/services/health/science-research-data.html">Health science, research and data</gcds-breadcrumbs-item>
                <gcds-breadcrumbs-item href="https://health-infobase.canada.ca/">Health Infobase</gcds-breadcrumbs-item>
            </gcds-breadcrumbs>
            `,
            catalogueName: "Catalogue",
            dictionaryName: "Data Dictionary",
            prototypeNotice: "This is just a prototype, not a real thing",
            footerHeading: "Contextual navigation",
        },
        fr: {
            pageTitle: 'Visionneuse du catalogue de données',
            introText: "Explorez le catalogue de données de l'Agence de la santé publique du Canada",
            lastUpdatedLabel: 'Dernière mise à jour',
            breadcrumbsHTML: `
            <gcds-breadcrumbs>
                <gcds-breadcrumbs-item href="https://www.canada.ca/fr/services/sante.html">Santé</gcds-breadcrumbs-item>
                <gcds-breadcrumbs-item href="https://www.canada.ca/fr/services/sante/science-recherche-et-donnees.html">Sciences de la santé, recherche et données</gcds-breadcrumbs-item>
                <gcds-breadcrumbs-item href="https://sante-infobase.canada.ca/">Infobase Santé</gcds-breadcrumbs-item>
            </gcds-breadcrumbs>
            `,
            catalogueName: "Catalogue",
            dictionaryName: "Dictionnaire des données",
            prototypeNotice: "Ceci est juste un prototype, pas une version définitive",
            footerHeading: "Navigation contextuelle",
        }
    };

    // Update static text elements
    document.title = translations[language].pageTitle;
    document.getElementById('page-title').textContent = translations[language].pageTitle;
    document.getElementById('intro-text').textContent = translations[language].introText;
    document.getElementById('catalogue-text').textContent = translations[language].catalogueName;
    document.getElementById('dictionary-text').textContent = translations[language].dictionaryName;
    document.getElementById('breadcrumbs').innerHTML = translations[language].breadcrumbsHTML;
    document.getElementById('prototype-notice').textContent = translations[language].prototypeNotice;

    // Update gcds-footer attributes
    const footer = document.querySelector('gcds-footer');
    footer.setAttribute('contextual-heading', translations[language].footerHeading);

    // Fetch and update the last updated date from GitHub
    async function fetchLastUpdated() {
        try {
            const response = await fetch('https://api.github.com/repos/PHACDataHub/data-catalogue-prototype/commits/main');
            const data = await response.json();

            if (data.commit && data.commit.committer && data.commit.committer.date) {
                const lastUpdated = new Date(data.commit.committer.date).toISOString().split('T')[0];
                const label = translations[language].lastUpdatedLabel;
                document.getElementById('last-updated').textContent = `${label}: ${lastUpdated}`;
            } else {
                console.error('Invalid response format for GitHub API:', data);
            }
        } catch (error) {
            console.error('Error fetching last updated date:', error);
        }
    }

    fetchLastUpdated();

    // Fetch the appropriate data file
    const dataFile = language === 'fr' ? 'data/output-fr.json' : 'data/output-en.json';

    fetch(dataFile)
        .then(response => response.json())
        .then(data => {
            // Check if data is an array and has at least one element
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Data is empty or not an array.');
            }

            // Extract property names (keys) from the first object
            const propertyNames = Object.keys(data[0]);

            // Prepare columns for DataTables
            const columns = propertyNames.map((propName) => ({
                data: propName,
                title: propName
            }));

            // Initialize DataTables
            const table = $('#catalogueTable').DataTable({
                data: data,
                columns: columns,
                scrollX: true,
                scrollY: false,
                scroller: true,
                language: {
                    search: translations[language].search,
                    lengthMenu: translations[language].lengthMenu,
                    info: translations[language].info,
                    paginate: {
                        next: translations[language].next,
                        previous: translations[language].previous
                    }
                },
                dom: 
                    `<"top-toolbar d-flex justify-content-between"
                        <"left"l> <"right d-flex flex-column align-items-end"Bf>
                     >tip`,
                buttons: [
                    {
                        extend: 'copy',
                        text: `<i class="fa fa-download" aria-hidden="true"></i> ${language === 'fr' ? 'Copier' : 'Copy'}`,
                        titleAttr: language === 'fr' ? 'Copier les données' : 'Copy data',
                        escapeTitle: false
                    },
                    {
                        extend: 'csv',
                        text: `<i class="fa fa-download" aria-hidden="true"></i> ${language === 'fr' ? 'Exporter CSV' : 'Export CSV'}`,
                        titleAttr: language === 'fr' ? 'Exporter en CSV' : 'Export as CSV',
                        escapeTitle: false
                    },
                    {
                        extend: 'excel',
                        text: `<i class="fa fa-download" aria-hidden="true"></i> ${language === 'fr' ? 'Exporter Excel' : 'Export Excel'}`,
                        titleAttr: language === 'fr' ? 'Exporter en Excel' : 'Export as Excel',
                        escapeTitle: false
                    },
                    {
                        extend: 'pdf',
                        text: `<i class="fa fa-download" aria-hidden="true"></i> ${language === 'fr' ? 'Exporter PDF' : 'Export PDF'}`,
                        titleAttr: language === 'fr' ? 'Exporter en PDF' : 'Export as PDF',
                        escapeTitle: false
                    },
                    {
                        extend: 'print',
                        text: `<i class="fa fa-download" aria-hidden="true"></i> ${language === 'fr' ? 'Imprimer' : 'Print'}`,
                        titleAttr: language === 'fr' ? 'Imprimer les données' : 'Print data',
                        escapeTitle: false
                    }
                ]
            });
        })
        .catch(error => console.error('Error loading dictionary JSON:', error));
});
