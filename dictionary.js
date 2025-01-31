document.addEventListener('DOMContentLoaded', function () {
    // Get the 'lang' query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    let language = urlParams.get('lang') || localStorage.getItem('language') || navigator.language.split('-')[0];
    if (!['en', 'fr'].includes(language)) language = 'en';
    localStorage.setItem('language', language);
    document.documentElement.lang = language;

    // Select the gcds-header element and update the language switch link
    const header = document.querySelector('gcds-header');
    if (header) {
        console.log(`Current page: ${window.location.pathname}`);
        console.log(`Detected language: ${language}`);

        if (language === 'en') {
            header.setAttribute('lang-code', 'fr');
            header.setAttribute('lang-href', `${window.location.pathname}?lang=fr`);
        } else {
            header.setAttribute('lang-code', 'en');
            header.setAttribute('lang-href', `${window.location.pathname}?lang=en`);
        }
        
        console.log(`Set lang-href to: ${header.getAttribute('lang-href')}`);
    } else {
        console.error("gcds-header not found!");
    }

    // Translations for static text
    const translations = {
        en: {
            subtitle: 'Data Dictionary',
            pageTitle: 'Public Health Data Catalogue',
            introText: "Learn About the Public Health Agency of Canada's Data Catalogue",
            breadcrumbsHTML: `
            <gcds-breadcrumbs>
                <gcds-breadcrumbs-item href="https://www.canada.ca/en/services/health.html">Health</gcds-breadcrumbs-item>
                <gcds-breadcrumbs-item href="https://www.canada.ca/en/services/health/science-research-data.html">Health science, research and data</gcds-breadcrumbs-item>
                <gcds-breadcrumbs-item href="https://health-infobase.canada.ca/">Health Infobase</gcds-breadcrumbs-item>
            </gcds-breadcrumbs>
            `,
            prototypeNotice: "This is just a prototype, not a real thing",
            footerHeading: "Contextual navigation",
        },
        fr: {
            subtitle: 'Dictionnaire de données',
            pageTitle: 'Visionneuse du catalogue de données',
            introText: "Explorez le catalogue de données de l'Agence de la santé publique du Canada",
            breadcrumbsHTML: `
            <gcds-breadcrumbs>
                <gcds-breadcrumbs-item href="https://www.canada.ca/fr/services/sante.html">Santé</gcds-breadcrumbs-item>
                <gcds-breadcrumbs-item href="https://www.canada.ca/fr/services/sante/science-recherche-et-donnees.html">Sciences de la santé, recherche et données</gcds-breadcrumbs-item>
                <gcds-breadcrumbs-item href="https://sante-infobase.canada.ca/">Infobase Santé</gcds-breadcrumbs-item>
            </gcds-breadcrumbs>
            `,
            prototypeNotice: "Ceci est juste un prototype, pas une version définitive",
            footerHeading: "Navigation contextuelle",
        }
    };

    // Update static text elements
    document.getElementById('page-title').textContent = translations[language].pageTitle;
    document.querySelectorAll('.subtitle').forEach(el => {
        el.textContent = translations[language].subtitle;
    });
    document.getElementById('intro-text').textContent = translations[language].introText;
    document.getElementById('breadcrumbs').innerHTML = translations[language].breadcrumbsHTML;
    document.getElementById('prototype-notice').textContent = translations[language].prototypeNotice;

    // Update gcds-footer attributes
    const footer = document.querySelector('gcds-footer');
    footer.setAttribute('contextual-heading', translations[language].footerHeading);

    // Load JSON data and initialize DataTable
    const jsonFile = language === 'fr' ? 'data/dictionary_fr.json' : 'data/dictionary_en.json';
    
    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            const tableData = Object.entries(data).map(([field, description]) => ({ field, description }));

            $('#catalogueTable').DataTable({
                data: tableData,
                columns: [
                    { title: language === 'fr' ? 'Nom du champ' : 'Field Name', data: 'field' },
                    { title: language === 'fr' ? 'Description' : 'Description', data: 'description' }
                ],
                paging: true,
                searching: true,
                responsive: true,
                language: {
                    url: language === 'fr' ? 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/French.json' : ''
                }
            });
        })
        .catch(error => console.error('Error loading dictionary JSON:', error));
});
