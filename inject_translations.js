const fs = require('fs');
const locales = ['es', 'en', 'fr', 'it', 'de', 'nl', 'ca'];
const obj = {
    es: {
        step1: {
            title: '¿Qué proceso te quita más tiempo a la semana?',
            subtitle: 'Ayudanos a personalizar tu experiencia enfocándonos en lo importante.',
            options: { budgeting: 'Presupuestar y buscar precios', costControl: 'Control de desviaciones y márgenes', certifications: 'Cuadrar horas y certificaciones' }
        },
        step2: {
            title1: '¿Cuántas obras gestionáis a la vez?',
            options1: { '1-3': { label: '1 – 3 obras', desc: 'Autónomo / Micro' }, '4-10': { label: '4 – 10 obras', desc: 'Pyme' }, '10+': { label: '+10 obras', desc: 'Constructora' } },
            title2: '¿Cuál es tu rol?',
            options2: { owner: 'Gerente', projectManager: 'Dir. de Obra', admin: 'Administración', surveyor: 'Aparejador' }
        },
        step3: {
            title1: '¿Cuánto gastas al año en aparejadores o gestión técnica?',
            options1: { '<10k': 'Menos de 10k €', '10-30k': 'De 10k a 30k €', '30-60k': 'De 30k a 60k €', '60k+': 'Más de 60k €' },
            title2: '¿Cuántas horas semanales dedicas a trabajo manual (Excel, papel, WhatsApp)?',
            options2: { '<5h': 'Menos de 5h', '5-15h': '5 - 15 horas', '15-30h': '15 - 30 horas', '30h+': '+30 horas' }
        },
        step4: {
            title: 'Último paso', subtitle: 'Datos básicos de tu empresa.',
            companyNameLabel: '¿Cómo se llama tu empresa?', companyNamePlaceholder: 'Escribe el nombre de tu empresa...', companySizeLabel: 'Tamaño de empresa',
            companySizeOptions: { 'solo': 'Solo 1', '2-5': '2-5', '6-15': '6-15', '16-50': '16-50', '50+': '50+' },
            stackLabel: '¿Desde qué herramientas planeas migrar?',
            stackOptions: { excel: 'Excel / Word', presto: 'Presto / Arquímedes', otherErp: 'Otro ERP (Procore, Holded...)' }
        },
        common: { stepIndicator: 'Paso', of: 'de', next: 'Siguiente', errorCompleting: 'Por favor, completa todos los campos.', unknownError: 'Error desconocido' }
    },
    en: {
        step1: {
            title: 'Which process takes up most of your time each week?',
            subtitle: 'Help us personalize your experience by focusing on what matters.',
            options: { budgeting: 'Estimating and sourcing prices', costControl: 'Controlling deviations and margins', certifications: 'Reconciling hours and certifications' }
        },
        step2: {
            title1: 'How many projects do you manage simultaneously?',
            options1: { '1-3': { label: '1 – 3 projects', desc: 'Freelance / Micro' }, '4-10': { label: '4 – 10 projects', desc: 'SME' }, '10+': { label: '+10 projects', desc: 'Construction Co.' } },
            title2: 'What is your role?',
            options2: { owner: 'Manager/Owner', projectManager: 'Site Manager', admin: 'Administration', surveyor: 'Quantity Surveyor' }
        },
        step3: {
            title1: 'How much do you spend annually on surveyors or technical management?',
            options1: { '<10k': 'Under 10k €', '10-30k': '10k to 30k €', '30-60k': '30k to 60k €', '60k+': 'Over 60k €' },
            title2: 'How many hours a week do you spend on manual tasks (Excel, paper, WhatsApp)?',
            options2: { '<5h': 'Under 5h', '5-15h': '5 - 15 hours', '15-30h': '15 - 30 hours', '30h+': '+30 hours' }
        },
        step4: {
            title: 'Last step', subtitle: 'Basic details about your company.',
            companyNameLabel: 'What is your company called?', companyNamePlaceholder: 'Enter your company name...', companySizeLabel: 'Company size',
            companySizeOptions: { 'solo': 'Just 1', '2-5': '2-5', '6-15': '6-15', '16-50': '16-50', '50+': '50+' },
            stackLabel: 'From which tools do you plan to migrate?',
            stackOptions: { excel: 'Excel / Word', presto: 'Presto / Archimed', otherErp: 'Other ERP (Procore, Holded...)' }
        },
        common: { stepIndicator: 'Step', of: 'of', next: 'Next', errorCompleting: 'Please complete all fields.', unknownError: 'Unknown error' }
    },
    fr: {
        step1: {
            title: 'Quel processus vous prend le plus de temps par semaine ?',
            subtitle: 'Aidez-nous à personnaliser votre expérience en nous concentrant sur l\'essentiel.',
            options: { budgeting: 'Devis et recherche de prix', costControl: 'Contrôle des écarts et des marges', certifications: 'Pointage des heures et certifications' }
        },
        step2: {
            title1: 'Combien de chantiers gérez-vous simultanément ?',
            options1: { '1-3': { label: '1 – 3 chantiers', desc: 'Indépendant / Micro' }, '4-10': { label: '4 – 10 chantiers', desc: 'PME' }, '10+': { label: '+10 chantiers', desc: 'Entreprise générale' } },
            title2: 'Quel est votre rôle ?',
            options2: { owner: 'Gérant', projectManager: 'Chef de chantier', admin: 'Administration', surveyor: 'Économiste / Métreur' }
        },
        step3: {
            title1: 'Combien dépensez-vous par an en métreurs ou en gestion technique ?',
            options1: { '<10k': 'Moins de 10k €', '10-30k': 'De 10k à 30k €', '30-60k': 'De 30k à 60k €', '60k+': 'Plus de 60k €' },
            title2: 'Combien d\'heures par semaine consacrez-vous aux tâches manuelles ?',
            options2: { '<5h': 'Moins de 5h', '5-15h': '5 - 15 heures', '15-30h': '15 - 30 heures', '30h+': '+30 heures' }
        },
        step4: {
            title: 'Dernière étape', subtitle: 'Informations de base de votre entreprise.',
            companyNameLabel: 'Comment s\'appelle votre entreprise ?', companyNamePlaceholder: 'Saisissez le nom de votre entreprise...', companySizeLabel: 'Taille de l\'entreprise',
            companySizeOptions: { 'solo': '1 seul', '2-5': '2-5', '6-15': '6-15', '16-50': '16-50', '50+': '50+' },
            stackLabel: 'Depuis quels outils prévoyez-vous de migrer ?',
            stackOptions: { excel: 'Excel / Word', presto: 'Presto / Arquímedes', otherErp: 'Autre ERP (Procore, Holded...)' }
        },
        common: { stepIndicator: 'Étape', of: 'sur', next: 'Suivant', errorCompleting: 'Veuillez remplir tous les champs.', unknownError: 'Erreur inconnue' }
    },
    it: {
        step1: {
            title: 'Quale processo ti porta via più tempo alla settimana?',
            subtitle: 'Aiutaci a personalizzare la tua esperienza concentrandoci su ciò che conta.',
            options: { budgeting: 'Preventivazione e ricerca prezzi', costControl: 'Controllo degli scostamenti e dei margini', certifications: 'Consuntivazione ore e SAL' }
        },
        step2: {
            title1: 'Quanti cantieri gestite contemporaneamente?',
            options1: { '1-3': { label: '1 – 3 cantieri', desc: 'Lavoratore autonomo' }, '4-10': { label: '4 – 10 cantieri', desc: 'PMI' }, '10+': { label: '+10 cantieri', desc: 'Impresa Edile' } },
            title2: 'Qual è il tuo ruolo?',
            options2: { owner: 'Titolare', projectManager: 'Direttore Lavori', admin: 'Amministrazione', surveyor: 'Geometra / Computista' }
        },
        step3: {
            title1: 'Quanto spendi all\'anno per geometri o gestione tecnica?',
            options1: { '<10k': 'Meno di 10k €', '10-30k': 'Tra 10k e 30k €', '30-60k': 'Tra 30k e 60k €', '60k+': 'Più di 60k €' },
            title2: 'Quante ore a settimana dedichi al lavoro manuale (Excel, carta)?',
            options2: { '<5h': 'Meno di 5h', '5-15h': '5 - 15 ore', '15-30h': '15 - 30 ore', '30h+': '+30 ore' }
        },
        step4: {
            title: 'Ultimo passo', subtitle: 'Dati base della tua azienda.',
            companyNameLabel: 'Come si chiama la tua azienda?', companyNamePlaceholder: 'Inserisci il nome della tua azienda...', companySizeLabel: 'Dimensione aziendale',
            companySizeOptions: { 'solo': 'Solo 1', '2-5': '2-5', '6-15': '6-15', '16-50': '16-50', '50+': '50+' },
            stackLabel: 'Da quali strumenti prevedi di migrare?',
            stackOptions: { excel: 'Excel / Word', presto: 'Presto / Arquímedes', otherErp: 'Altro ERP (Procore, Holded...)' }
        },
        common: { stepIndicator: 'Passo', of: 'di', next: 'Avanti', errorCompleting: 'Si prega di completare tutti i campi.', unknownError: 'Errore sconosciuto' }
    },
    de: {
        step1: {
            title: 'Welcher Prozess nimmt wöchentlich die meiste Zeit in Anspruch?',
            subtitle: 'Helfen Sie uns, Ihre Erfahrung zu personalisieren.',
            options: { budgeting: 'Kalkulation & Preisfindung', costControl: 'Abweichungs- & Margenkontrolle', certifications: 'Stundenerfassung & Leistungsnachweise' }
        },
        step2: {
            title1: 'Wie viele Baustellen verwalten Sie gleichzeitig?',
            options1: { '1-3': { label: '1 – 3', desc: 'Selbständig / Mikro' }, '4-10': { label: '4 – 10', desc: 'KMU' }, '10+': { label: '+10', desc: 'Bauunternehmen' } },
            title2: 'Was ist Ihre Rolle?',
            options2: { owner: 'Inhaber / Geschäftsführer', projectManager: 'Bauleiter', admin: 'Verwaltung', surveyor: 'Kalkulator / Bauzeichner' }
        },
        step3: {
            title1: 'Wie viel geben Sie jährlich für Bauleiter oder technisches Management aus?',
            options1: { '<10k': 'Unter 10k €', '10-30k': '10k bis 30k €', '30-60k': '30k bis 60k €', '60k+': 'Über 60k €' },
            title2: 'Wie viele Stunden pro Woche verbringen Sie mit manuellen Aufgaben?',
            options2: { '<5h': 'Unter 5h', '5-15h': '5 - 15 Stunden', '15-30h': '15 - 30 Stunden', '30h+': '+30 Stunden' }
        },
        step4: {
            title: 'Letzter Schritt', subtitle: 'Grunddaten Ihres Unternehmens.',
            companyNameLabel: 'Wie heißt Ihr Unternehmen?', companyNamePlaceholder: 'Geben Sie Ihren Unternehmensnamen ein...', companySizeLabel: 'Unternehmensgröße',
            companySizeOptions: { 'solo': 'Nur 1', '2-5': '2-5', '6-15': '6-15', '16-50': '16-50', '50+': '50+' },
            stackLabel: 'Von welchen Tools planen Sie zu migrieren?',
            stackOptions: { excel: 'Excel / Word', presto: 'Presto / Archimed', otherErp: 'Anderes ERP' }
        },
        common: { stepIndicator: 'Schritt', of: 'von', next: 'Weiter', errorCompleting: 'Bitte alle Felder ausfüllen.', unknownError: 'Unbekannter Fehler' }
    },
    nl: {
        step1: {
            title: 'Welk proces kost je wekelijks de meeste tijd?',
            subtitle: 'Help ons je ervaring te personaliseren.',
            options: { budgeting: 'Begroten en prijzen zoeken', costControl: 'Beheer van afwijkingen en marges', certifications: 'Uren en termijnstaten kloppend maken' }
        },
        step2: {
            title1: 'Hoeveel projecten beheer je tegelijkertijd?',
            options1: { '1-3': { label: '1 – 3 projecten', desc: 'ZZP\'er / Micro' }, '4-10': { label: '4 – 10 projecten', desc: 'MKB' }, '10+': { label: '+10 projecten', desc: 'Aannemersbedrijf' } },
            title2: 'Wat is je rol?',
            options2: { owner: 'Directeur/Eigenaar', projectManager: 'Uitvoerder', admin: 'Administratie', surveyor: 'Calculator / Werkvoorbereider' }
        },
        step3: {
            title1: 'Hoeveel besteed je jaarlijks aan calculators of technisch beheer?',
            options1: { '<10k': 'Minder dan 10k €', '10-30k': 'Van 10k tot 30k €', '30-60k': 'Van 30k tot 60k €', '60k+': 'Meer dan 60k €' },
            title2: 'Hoeveel uur per week besteed je aan handmatig werk?',
            options2: { '<5h': 'Minder dan 5u', '5-15h': '5 - 15 uur', '15-30h': '15 - 30 uur', '30h+': '+30 uur' }
        },
        step4: {
            title: 'Laatste stap', subtitle: 'Basisgegevens van je bedrijf.',
            companyNameLabel: 'Hoe heet je bedrijf?', companyNamePlaceholder: 'Typ je bedrijfsnaam...', companySizeLabel: 'Bedrijfsgrootte',
            companySizeOptions: { 'solo': 'Alleen 1', '2-5': '2-5', '6-15': '6-15', '16-50': '16-50', '50+': '50+' },
            stackLabel: 'Vanaf welke tools ben je van plan over te stappen?',
            stackOptions: { excel: 'Excel / Word', presto: 'Presto / Archimed', otherErp: 'Ander ERP' }
        },
        common: { stepIndicator: 'Stap', of: 'van', next: 'Volgende', errorCompleting: 'Vul a.u.b. alle velden in.', unknownError: 'Onbekende fout' }
    },
    ca: {
        step1: {
            title: 'Quin procés et treu més temps a la setmana?',
            subtitle: 'Ajuda\'ns a personalitzar la teva experiència enfocant-nos en el que és important.',
            options: { budgeting: 'Pressupostar i buscar preus', costControl: 'Control de desviacions i marges', certifications: 'Quadrar hores i certificacions' }
        },
        step2: {
            title1: 'Quantes obres gestioneu alhora?',
            options1: { '1-3': { label: '1 – 3 obres', desc: 'Autònom / Micro' }, '4-10': { label: '4 – 10 obres', desc: 'Pime' }, '10+': { label: '+10 obres', desc: 'Constructora' } },
            title2: 'Quin és el teu rol?',
            options2: { owner: 'Gerent', projectManager: 'Dir. d\'Obra', admin: 'Administració', surveyor: 'Aparellador' }
        },
        step3: {
            title1: 'Quant gastes a l\'any en aparelladors o gestió tècnica?',
            options1: { '<10k': 'Menys de 10k €', '10-30k': 'De 10k a 30k €', '30-60k': 'De 30k a 60k €', '60k+': 'Més de 60k €' },
            title2: 'Quantes hores setmanals dediques a feina manual (Excel, paper, WhatsApp)?',
            options2: { '<5h': 'Menys de 5h', '5-15h': '5 - 15 hores', '15-30h': '15 - 30 hores', '30h+': '+30 hores' }
        },
        step4: {
            title: 'Últim pas', subtitle: 'Dades bàsiques de la teva empresa.',
            companyNameLabel: 'Com es diu la teva empresa?', companyNamePlaceholder: 'Escriu el nom de la teva empresa...', companySizeLabel: 'Mida de l\'empresa',
            companySizeOptions: { 'solo': 'Només 1', '2-5': '2-5', '6-15': '6-15', '16-50': '16-50', '50+': '50+' },
            stackLabel: 'Des de quines eines planeges migrar?',
            stackOptions: { excel: 'Excel / Word', presto: 'Presto / Arquímedes', otherErp: 'Un altre ERP (Procore, Holded...)' }
        },
        common: { stepIndicator: 'Pas', of: 'de', next: 'Següent', errorCompleting: 'Si us plau, completa tots els camps.', unknownError: 'Error desconegut' }
    }
};
for (const l of locales) {
    const file = 'src/locales/' + l + '/home.json';
    if (fs.existsSync(file)) {
        let raw = fs.readFileSync(file, 'utf8');
        raw = raw.replace(/^\uFEFF/, '').trim();
        let data = JSON.parse(raw);
        if (!data.basis) data.basis = {};
        data.basis.profiling = obj[l];
        fs.writeFileSync(file, JSON.stringify(data, null, 4));
        console.log('Fixed ' + l);
    }
}
