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

    // Set page title
    document.title = language === 'fr' ? 'Prototype de visionneuse de catalogue de données de l\'ASPC' : 'PHAC Data Catalogue Viewer Prototype';

    // Translations for static text
    const translations = {
        en: {
            pageTitle: 'Public Health Data Catalogue',
            introText: "Explore the Public Health Agency of Canada's Data Catalogue",
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
            column: "column"
        },
        fr: {
            pageTitle: 'Visionneuse du catalogue de données',
            introText: "Explorez le catalogue de données de l'Agence de la santé publique du Canada",
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
            column: "colonne"
        }
    };

    // Update static text elements
    document.getElementById('page-title').textContent = translations[language].pageTitle;
    document.getElementById('intro-text').textContent = translations[language].introText;
    document.getElementById('toggle-columns-label').textContent = translations[language].toggleColumns;

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
                }
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
            const columnsToHide = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
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


