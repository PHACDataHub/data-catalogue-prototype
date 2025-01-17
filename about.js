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
            subtitle: 'Learn More',
            pageTitle: 'Public Health Data Catalogue',
            introText: "Learn About the Public Health Agency of Canada's Data Catalogue",
            detailedContent: `
            <p class="mb-300">This page lets you explore information about what data the Public Health Agency of Canada (PHAC) uses to protect and promote the health of people in Canada. We built this page to let you see what data we use.</p>
            <p class="mb-300">This page includes datasets that are of public interest. It includes a variety of datasets covering topics like public health trends, disease tracking, and population health statistics . Not all datasets are permitted to be shared publicly due to things like privacy concerns or data sharing agreements.</p>
            <p class="mb-300">On this page you can explore details about our datasets to better understand what information we use to make public health decisions. By providing this tool, we aim to support open information principles outlined in the Policy on Service and Digital, ensuring that our datasets are easily accessible and understandable to everyone.</p>
            <h3 class="mt-600 mb-300">Related Links</h3>
            <ul class="list-disc mb-300">
                <li><p class="mb-300"><a href="https://www.canada.ca/en/public-health/services/data/gathering.html"> Gathering Data</a></p></li>
                <li><p class="mb-300"><a href="https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32603">Policy on Service and Digital</a></p></li>
                <li><p class="mb-300"><a href="https://open.canada.ca/en">Open Government</a></p></li>
            </ul>
            `,
            prototypeNotice: "This is just a prototype, not a real thing",
            footerHeading: "Contextual navigation",
        },
        fr: {
            subtitle: 'Apprendre encore plus',
            pageTitle: 'Visionneuse du catalogue de données',
            introText: "Explorez le catalogue de données de l'Agence de la santé publique du Canada",
            detailedContent: `
            <p class="mb-300">Cette page vous permet d'explorer des informations sur les données utilisées par l'Agence de la santé publique du Canada (ASPC) pour protéger et promouvoir la santé des personnes au Canada. Nous avons créé cette page pour vous montrer les données que nous utilisons.</p>
            <p class="mb-300">Cette page comprend des ensembles de données d'intérêt public. Elle contient une variété de données couvrant des sujets tels que les tendances en santé publique, le suivi des maladies et les statistiques de santé de la population. Tous les ensembles de données ne peuvent pas être partagés publiquement en raison de préoccupations liées à la confidentialité ou à des accords de partage de données.</p>
            <p class="mb-300">Sur cette page, vous pouvez explorer les détails de nos ensembles de données pour mieux comprendre les informations que nous utilisons pour prendre des décisions en matière de santé publique. En fournissant cet outil, nous visons à soutenir les principes d'ouverture de l'information définis dans la Politique sur le service et le numérique, en veillant à ce que nos ensembles de données soient facilement accessibles et compréhensibles par tous.</p>            
            <ul class="list-disc mb-300">
                <li><p class="mb-300"><a href="https://www.canada.ca/fr/sante-publique/services/donnee/collecte.html">Collecte de données</a></p></li>
                <li><p class="mb-300"><a href="https://www.tbs-sct.canada.ca/pol/doc-fra.aspx?id=32603">Politique sur le service et le numérique</a></p></li>
                <li><p class="mb-300"><a href="https://ouvert.canada.ca/fr">Gouvernement ouvert</a></p></li>
            </ul>

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