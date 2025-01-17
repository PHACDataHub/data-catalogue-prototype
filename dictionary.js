// populates the content for the about page in french and english.

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
            subtitle: 'Data Dictionary',
            pageTitle: 'Public Health Data Catalogue',
            introText: "Learn About the Public Health Agency of Canada's Data Catalogue",
            detailedContent: `
            <p class="mb-300">This page lets you explore information about what data the Public Health Agency of Canada (PHAC) uses to protect and promote the health of people in Canada. We built this page to let you see what data we use.</p>
            `,
            prototypeNotice: "This is just a prototype, not a real thing",
            footerHeading: "Contextual navigation",
        },
        fr: {
            subtitle: 'Dictionnaire de données',
            pageTitle: 'Visionneuse du catalogue de données',
            introText: "Explorez le catalogue de données de l'Agence de la santé publique du Canada",
            detailedContent: `
            <p class="mb-300">Cette page vous permet d'explorer des informations sur les données utilisées par l'Agence de la santé publique du Canada (ASPC) pour protéger et promouvoir la santé des personnes au Canada. Nous avons créé cette page pour vous montrer les données que nous utilisons.</p>
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
    document.getElementById('detailed-content').innerHTML = translations[language].detailedContent;

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
});