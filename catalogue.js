/*
This script populates the content on the data catalogue page in both French and English.
It also builds the HTML data table based on the data in data/output-fr.json and data/output-en.json
It also deals with anything related to the datatables library, like the horizontal scrollbar, show/hide columns, etc.
*/

document.addEventListener('DOMContentLoaded', function () {
    // Get the 'lang' query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');

    // Sets language by default based on browser preference
    let userLang = navigator.language || navigator.userLanguage;
    userLang = userLang.split('-')[0];

    let language = urlLang || localStorage.getItem('language') || userLang || 'en';

    // sets language by to english if user hasn't selected french or english and their browser isn't set to french or english
    if (!['en', 'fr'].includes(language)) language = 'en';
    localStorage.setItem('language', language);
    document.documentElement.lang = language;

    // Translations for static text
    const translations = {
        en: {
            pageTitle: 'Public Health Data Catalogue',
            introText: "Explore the Public Health Agency of Canada's Data Catalogue",
            breadcrumbsHTML: `
            <gcds-breadcrumbs>
                <gcds-breadcrumbs-item href="https://www.canada.ca/en/services/health.html">Health</gcds-breadcrumbs-item>
                <gcds-breadcrumbs-item href="https://www.canada.ca/en/services/health/science-research-data.html">Health science, research and data</gcds-breadcrumbs-item>
                <gcds-breadcrumbs-item href="https://health-infobase.canada.ca/">Health Infobase</gcds-breadcrumbs-item>
            </gcds-breadcrumbs>
            `,
            catalogueName: "Catalogue",
            dictionaryName: "Data Dictionary",
            detailedContent: `
            <p class="mb-300">This page lets you explore information about what data the Public Health Agency of Canada (PHAC) uses to protect and promote the health of people in Canada. We built this page to let you see what data we use.</p>
            <p class="mb-300">This page includes datasets that are of public interest. It includes a variety of datasets covering topics like public health trends, disease tracking, and population health statistics . Not all datasets are permitted to be shared publicly due to things like privacy concerns or data sharing agreements.</p>
            <p class="mb-300">On this page you can explore details about our datasets to better understand what information we use to make public health decisions. By providing this tool, we aim to support open information principles outlined in the Policy on Service and Digital, ensuring that our datasets are easily accessible and understandable to everyone.</p>
            `,
            toggleColumns: "Click to add or remove columns:",
            search: "Search Catalogue",
            prototypeNotice: "This is just a prototype, not a real thing",
            footerHeading: "Contextual navigation",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            next: "Next",
            previous: "Previous",
            show: "Show",
            hide: "Hide",
            column: "column",
            relatedLinks: `
            <h3 class="mt-600 mb-300">Related Links</h3>
            <ul class="list-disc mb-300">
                <li><p class="mb-300"><a href="https://www.canada.ca/en/public-health/services/data/gathering.html"> Gathering Data</a></p></li>
                <li><p class="mb-300"><a href="https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32603">Policy on Service and Digital</a></p></li>
                <li><p class="mb-300"><a href="https://open.canada.ca/en">Open Government</a></p></li>
            </ul>

            `
        },
        fr: {
            pageTitle: 'Visionneuse du catalogue de données',
            introText: "Explorez le catalogue de données de l'Agence de la santé publique du Canada",
            breadcrumbsHTML: `
            <gcds-breadcrumbs>
                <gcds-breadcrumbs-item href="https://www.canada.ca/fr/services/sante.html">Santé</gcds-breadcrumbs-item>
                <gcds-breadcrumbs-item href="https://www.canada.ca/fr/services/sante/science-recherche-et-donnees.html">Sciences de la santé, recherche et données</gcds-breadcrumbs-item>
                <gcds-breadcrumbs-item href="https://sante-infobase.canada.ca/">Infobase Santé</gcds-breadcrumbs-item>
            </gcds-breadcrumbs>
            `,
            catalogueName: "Catalogue",
            dictionaryName: "Dictionnaire des données",
            detailedContent: `
            <p class="mb-300">Cette page vous permet d'explorer des informations sur les données utilisées par l'Agence de la santé publique du Canada (ASPC) pour protéger et promouvoir la santé des personnes au Canada. Nous avons créé cette page pour vous montrer les données que nous utilisons.</p>
            <p class="mb-300">Cette page comprend des ensembles de données d'intérêt public. Elle contient une variété de données couvrant des sujets tels que les tendances en santé publique, le suivi des maladies et les statistiques de santé de la population. Tous les ensembles de données ne peuvent pas être partagés publiquement en raison de préoccupations liées à la confidentialité ou à des accords de partage de données.</p>
            <p class="mb-300">Sur cette page, vous pouvez explorer les détails de nos ensembles de données pour mieux comprendre les informations que nous utilisons pour prendre des décisions en matière de santé publique. En fournissant cet outil, nous visons à soutenir les principes d'ouverture de l'information définis dans la Politique sur le service et le numérique, en veillant à ce que nos ensembles de données soient facilement accessibles et compréhensibles par tous.</p>
            `,
            toggleColumns: "Cliquez pour ajouter ou supprimer des colonnes :",
            search: "Rechercher dans le catalogue",
            prototypeNotice: "Ceci est juste un prototype, pas une version définitive",
            footerHeading: "Navigation contextuelle",
            lengthMenu: "Afficher _MENU_ entrées",
            info: "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
            next: "Suivant",
            previous: "Précédent",
            show: "Afficher",
            hide: "Masquer",
            column: "colonne",
            relatedLinks: `
            <h3 class="mt-600 mb-300">Liens connexes</h3>
            <ul class="list-disc mb-300">
                <li><p class="mb-300"><a href="https://www.canada.ca/fr/sante-publique/services/donnee/collecte.html">Collecte de données</a></p></li>
                <li><p class="mb-300"><a href="https://www.tbs-sct.canada.ca/pol/doc-fra.aspx?id=32603">Politique sur le service et le numérique</a></p></li>
                <li><p class="mb-300"><a href="https://ouvert.canada.ca/fr">Gouvernement ouvert</a></p></li>
            </ul>

            `
        }
    };

    // Update static text elements
    document.title = translations[language].pageTitle;
    document.getElementById('page-title').textContent = translations[language].pageTitle;
    document.getElementById('intro-text').textContent = translations[language].introText;
    document.getElementById('catalogue-text').textContent = translations[language].catalogueName;
    document.getElementById('dictionary-text').textContent = translations[language].dictionaryName;
    document.getElementById('breadcrumbs').innerHTML = translations[language].breadcrumbsHTML;
    document.getElementById('detailed-content').innerHTML = translations[language].detailedContent;
    document.getElementById('toggle-columns-label').textContent = translations[language].toggleColumns;
    document.getElementById('related-links').innerHTML = translations[language].relatedLinks;

    // Update prototype notice using the new ID
    document.getElementById('prototype-notice').textContent = translations[language].prototypeNotice;

    // Update gcds-footer attributes
    const footer = document.querySelector('gcds-footer');
    footer.setAttribute('contextual-heading', translations[language].footerHeading);

    // Update the gcds-header attributes based on the current language
    const header = document.querySelector('gcds-header');

    if (language === 'en') {
        header.setAttribute('lang-code', 'fr');
        header.setAttribute('lang-href', '?lang=fr');
    } else {
        header.setAttribute('lang-code', 'en');
        header.setAttribute('lang-href', '?lang=en');
    }

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

            // Generate toggle buttons dynamically
            const toggleColumnsContainer = document.querySelector('.toggle-columns');

            // Remove existing buttons if any
            const existingButtons = toggleColumnsContainer.querySelectorAll('button');
            existingButtons.forEach(button => button.remove());

            columns.forEach((col, index) => {
                const button = document.createElement('button');
                button.classList.add('toggle-vis');
                button.textContent = col.title;
                button.dataset.column = index;
                const visibilityAction = table.column(index).visible() ? translations[language].hide : translations[language].show;
                button.setAttribute('aria-label', `${visibilityAction} ${col.title} ${translations[language].column}`);
                if (table.column(index).visible()) {
                    button.classList.add('visible-column');
                }
                toggleColumnsContainer.appendChild(button);
            });

            // Initially hide certain columns (adjust indices as needed)
            const columnsToHide = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            table.columns(columnsToHide).visible(false);

            // Update toggle buttons to match initial column visibility
            columnsToHide.forEach(index => {
                const button = toggleColumnsContainer.querySelector(`button[data-column="${index}"]`);
                if (button) {
                    button.classList.remove('visible-column');
                    button.setAttribute('aria-label', `${translations[language].show} ${button.textContent} ${translations[language].column}`);
                }
            });

            // Handle column visibility toggling
            toggleColumnsContainer.addEventListener('click', function (event) {
                if (event.target.tagName === 'BUTTON') {
                    event.preventDefault();
                    let columnIdx = event.target.dataset.column;
                    let column = table.column(columnIdx);

                    // Toggle the visibility
                    column.visible(!column.visible());

                    // Update button style and ARIA label
                    if (column.visible()) {
                        event.target.classList.add('visible-column');
                        event.target.setAttribute('aria-label', `${translations[language].hide} ${event.target.textContent} ${translations[language].column}`);
                    } else {
                        event.target.classList.remove('visible-column');
                        event.target.setAttribute('aria-label', `${translations[language].show} ${event.target.textContent} ${translations[language].column}`);
                    }
                }
            });

            (function () {
                var dtScrollBodies = document.querySelectorAll('.dt-scroll-body');
            
                dtScrollBodies.forEach(function (dtScrollBody) {
                    // Create a spacer element after dtScrollBody
                    var spacer = document.createElement('div');
                    spacer.className = 'spacer';
                    dtScrollBody.parentNode.insertBefore(spacer, dtScrollBody.nextSibling);
            
                    function adjustHeight() {
                        var viewportHeight = window.innerHeight;
                        var dtScrollBodyRect = dtScrollBody.getBoundingClientRect();
                        var dtScrollBodyTop = dtScrollBodyRect.top;
                        var naturalHeight = dtScrollBody.scrollHeight;
            
                        var availableHeight = viewportHeight - dtScrollBodyTop;
            
                        // Ensure we don't set height larger than natural height
                        var adjustedHeight = Math.min(availableHeight, naturalHeight);
            
                        // Set the height of dt-scroll-body
                        dtScrollBody.style.height = adjustedHeight + 'px';
            
                        // Adjust spacer height to compensate for dynamic height change
                        var spacerHeight = naturalHeight - adjustedHeight;
                        spacer.style.height = spacerHeight + 'px';
            
                        // Check if horizontal scrolling is needed
                        checkHorizontalScroll();
                    }
            
                    function checkHorizontalScroll() {
                        var table = dtScrollBody.querySelector('table');
                        if (!table) return;
            
                        var tableRect = table.getBoundingClientRect();
                        var containerRect = dtScrollBody.getBoundingClientRect();
            
                        // Check if table is scrolled to the left (hidden content to the right)
                        if (tableRect.right > containerRect.right) {
                            dtScrollBody.classList.add('scrolled-left');
                        } else {
                            dtScrollBody.classList.remove('scrolled-left');
                        }
            
                        // Check if table is scrolled to the right (hidden content to the left)
                        if (tableRect.left < containerRect.left) {
                            dtScrollBody.classList.add('scrolled-right');
                        } else {
                            dtScrollBody.classList.remove('scrolled-right');
                        }
                    }
            
                    // Add scroll event listener to dtScrollBody to detect horizontal scrolling
                    dtScrollBody.addEventListener('scroll', function () {
                        checkHorizontalScroll();
                    });
            
                    // Throttle the function to improve performance
                    var resizeTimer;
                    function onResizeOrScroll() {
                        clearTimeout(resizeTimer);
                        resizeTimer = setTimeout(adjustHeight, 1);
                    }
            
                    window.addEventListener('resize', onResizeOrScroll);
                    window.addEventListener('scroll', onResizeOrScroll);
                    window.addEventListener('click', onResizeOrScroll);
            
                    // Initial adjustment
                    adjustHeight();
            
                    // Initial check for scroll position
                    checkHorizontalScroll();
                });
            })();
            
            

        })
        .catch(error => console.error('Error:', error));
});


