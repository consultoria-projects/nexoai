const fs = require('fs');
const locales = ['es', 'en', 'fr', 'it', 'de', 'nl', 'ca'];
const obj = {
    es: {
        header: {
            title: 'Arquitecto IA',
            subtitle: 'Asistente Inteligente',
            clearTooltip: 'Borrar conversación y empezar de nuevo'
        },
        emptyState: {
            title: '¿En qué puedo ayudarte hoy?',
            subtitle: 'Puedo ayudarte a estimar costos, definir materiales o planificar tu reforma integral.',
            suggestions: [
                { title: 'Reforma de cocina', text: 'Quiero reformar la cocina completa, con cambio de muebles y electrodomésticos.' },
                { title: 'Baño completo', text: 'Cambio de bañera por plato de ducha, alicatado y sanitarios nuevos.' },
                { title: 'Reforma integral', text: 'Presupuesto para reformar un piso completo de 90m2.' },
                { title: 'Suelos y pintura', text: 'Necesito cambiar el suelo a tarima flotante y pintar todo el piso liso.' }
            ]
        },
        input: {
            placeholder: 'Describe tu proyecto...',
            analyzingDocs: 'Analizando documentos... esto puede tardar unos segundos 🧠',
            transcribing: 'Transcribiendo audio...',
            recordingInfo: 'Grabando...',
            keyboardHint: 'Presiona Enter para enviar. Shift + Enter para línea nueva.',
            analyzingText: 'Analizando...'
        },
        panel: {
            title: 'Datos del Proyecto',
            status: 'En curso',
            completed: 'Completado',
            deepGenTitle: 'Generación Profunda',
            deepGenDesc: 'Desglosan por capítulos y partidas (más lento).'
        },
        progress: {
            generatingMsg: '(Generando presupuesto detallado...)',
            extracting: 'Extrayendo partidas...',
            searching: 'Buscando coincidencias...',
            calculating: 'Calculando totales...',
            generateBtn: 'Generar Presupuesto'
        },
        pdfDownloadCard: {
            title: 'Presupuesto Creado',
            subtitle: 'Tu presupuesto se ha generado y descargado correctamente.',
            nextStep: '¿Quieres automatizar esto o tener el asistente integrado?',
            benefits: 'Nuestra plataforma te permite invitar a subcontratistas, firmar digitalmente y conectar tu obra con precios reales.',
            button: 'Planifica Tu Obra'
        },
        errors: {
            resetConfirm: '¿Estás seguro de que quieres borrar la conversación? Esto no se puede deshacer.',
            generateError: 'No se pudo generar el presupuesto. '
        }
    },
    en: {
        header: {
            title: 'AI Architect',
            subtitle: 'Smart Assistant',
            clearTooltip: 'Clear conversation and start over'
        },
        emptyState: {
            title: 'How can I help you today?',
            subtitle: 'I can help estimate costs, define materials or plan your full renovation.',
            suggestions: [
                { title: 'Kitchen Remodel', text: 'I want to renovate the whole kitchen, changing funiture and appliances.' },
                { title: 'Full Bathroom', text: 'Change bathtub for shower tray, tiling and new toilets.' },
                { title: 'Full Renovation', text: 'Budget to completely renovate a 90 sqm apartment.' },
                { title: 'Floors and Paint', text: 'I need to change the floor to laminate and paint the whole apartment smooth.' }
            ]
        },
        input: {
            placeholder: 'Describe your project...',
            analyzingDocs: 'Analyzing documents... this might take a few seconds 🧠',
            transcribing: 'Transcribing audio...',
            recordingInfo: 'Recording...',
            keyboardHint: 'Press Enter to send. Shift + Enter for an ew line.',
            analyzingText: 'Analyzing...'
        },
        panel: {
            title: 'Project Data',
            status: 'In progress',
            completed: 'Completed',
            deepGenTitle: 'Deep Generation',
            deepGenDesc: 'Breaks down by chapters and items (slower).'
        },
        progress: {
            generatingMsg: '(Generating detailed budget...)',
            extracting: 'Extracting items...',
            searching: 'Searching for matches...',
            calculating: 'Calculating totals...',
            generateBtn: 'Generate Budget'
        },
        pdfDownloadCard: {
            title: 'Budget Created',
            subtitle: 'Your budget has been properly generated and downloaded.',
            nextStep: 'Do you want to automate this or have the integrated assistant?',
            benefits: 'Our platform allows you to invite subcontractors, sign digitally and connect your site with real prices.',
            button: 'Plan Your Site'
        },
        errors: {
            resetConfirm: 'Are you sure you want to clear the conversation? This cannot be undone.',
            generateError: 'Could not generate budget. '
        }
    },
    fr: {
        header: { title: 'Architecte IA', subtitle: 'Assistant Intelligent', clearTooltip: 'Effacer la conversation et recommencer' },
        emptyState: {
            title: 'Comment puis-je vous aider aujourd\'hui ?', subtitle: 'Je peux vous aider à estimer, définir des matériaux ou planifier votre rénovation.',
            suggestions: [
                { title: 'Rénovation cuisine', text: 'Je veux rénover la cuisine, changer meubles et électroménagers.' },
                { title: 'Salle de bain complète', text: 'Remplacer la baignoire par une douche, carrelage et nouveaux sanitaires.' },
                { title: 'Rénovation intégrale', text: 'Devis pour rénover un appartement complet de 90m2.' },
                { title: 'Sols et peinture', text: 'Je dois changer le sol en parquet flottant et peindre tout l\'appartement.' }
            ]
        },
        input: { placeholder: 'Décrivez votre projet...', analyzingDocs: 'Analyse des documents... 🧠', transcribing: 'Transcription audio...', recordingInfo: 'Enregistrement...', keyboardHint: 'Entrée pour envoyer. Shift + Entrée pour un saut de ligne.', analyzingText: 'Analyse en cours...' },
        panel: { title: 'Données du Projet', status: 'En cours', completed: 'Complété', deepGenTitle: 'Génération Profonde', deepGenDesc: 'Décomposition par lots (plus lent).' },
        progress: { generatingMsg: '(Génération du devis...)', extracting: 'Extraction...', searching: 'Recherche correspondances...', calculating: 'Calcul des totaux...', generateBtn: 'Générer le Devis' },
        pdfDownloadCard: { title: 'Devis Créé', subtitle: 'Votre devis a été généré et téléchargé.', nextStep: 'Voulez-vous automatiser cela ?', benefits: 'Notre plateforme permet d\'inviter, signer et lier aux prix réels.', button: 'Planifiez votre chantier' },
        errors: { resetConfirm: 'Êtes-vous sûr de vouloir effacer ? Ceci est irréversible.', generateError: 'Impossible de générer le devis. ' }
    },
    it: {
        header: { title: 'Architetto IA', subtitle: 'Assistente Intelligente', clearTooltip: 'Cancella conversazione e ricomincia' },
        emptyState: {
            title: 'Come posso aiutarti oggi?', subtitle: 'Posso aiutarti a stimare i costi, definire materiali o pianificare la tua ristrutturazione.',
            suggestions: [
                { title: 'Ristrutturazione Cucina', text: 'Voglio ristrutturare l\'intera cucina, cambiando mobili.' },
                { title: 'Bagno Completo', text: 'Cambio vasca con piatto doccia, piastrellatura e sanitari nuovi.' },
                { title: 'Ristrutturazione Integrale', text: 'Preventivo per ristrutturare un appartamento di 90mq.' },
                { title: 'Pavimenti e pittura', text: 'Devo cambiare il pavimento e dipingere l\'appartamento.' }
            ]
        },
        input: { placeholder: 'Descrivi il tuo progetto...', analyzingDocs: 'Analisi documenti... 🧠', transcribing: 'Trascrizione audio...', recordingInfo: 'Registrazione...', keyboardHint: 'Premi Invio per inviare. Shift+Invio per nuova riga.', analyzingText: 'In analisi...' },
        panel: { title: 'Dati Progetto', status: 'In corso', completed: 'Completato', deepGenTitle: 'Generazione Profonda', deepGenDesc: 'Suddivisione dettagliata (più lenta).' },
        progress: { generatingMsg: '(Generazione preventivo...)', extracting: 'Estrazione voci...', searching: 'Ricerca corrispondenze...', calculating: 'Calcolo totali...', generateBtn: 'Genera Preventivo' },
        pdfDownloadCard: { title: 'Preventivo Creato', subtitle: 'Preventivo generato e scaricato correttamente.', nextStep: 'Vuoi automatizzare questo processo?', benefits: 'Invita fornitori, firma documenti e usa prezzi reali.', button: 'Pianifica il cantiere' },
        errors: { resetConfirm: 'Sei sicuro di cancellare la conversazione?', generateError: 'Impossibile generare il preventivo. ' }
    },
    de: {
        header: { title: 'KI-Architekt', subtitle: 'Zusammenfassung', clearTooltip: 'Verlauf löschen' },
        emptyState: {
            title: 'Wie kann ich heute helfen?', subtitle: 'Ich helfe bei Kosten, Materialien und Umbauplanung.',
            suggestions: [
                { title: 'Küchenrenovierung', text: 'Ich möchte die Küche umbauen, Möbel und Geräte tauschen.' },
                { title: 'Komplettes Bad', text: 'Wanne durch Dusche ersetzen, neue Fliesen und Sanitäranlagen.' },
                { title: 'Vollständige Renovierung', text: 'Kostenvoranschlag für 90m2 Wohnung.' },
                { title: 'Böden und Farbe', text: 'Neuer Laminatboden und Wohnung streichen.' }
            ]
        },
        input: { placeholder: 'Projekt beschreiben...', analyzingDocs: 'Dokumente analysieren... 🧠', transcribing: 'Audio transkribieren...', recordingInfo: 'Aufnahme...', keyboardHint: 'Enter zum Senden. Shift+Enter für neue Zeile.', analyzingText: 'Analysieren...' },
        panel: { title: 'Projektdaten', status: 'Aktiv', completed: 'Abgeschlossen', deepGenTitle: 'Tiefe Generierung', deepGenDesc: 'Detaillierte Aufschlüsselung (langsamer).' },
        progress: { generatingMsg: '(Generiere Angebot...)', extracting: 'Extrahiere...', searching: 'Suche Treffer...', calculating: 'Berechne...', generateBtn: 'Angebot generieren' },
        pdfDownloadCard: { title: 'Angebot Erstellt', subtitle: 'Angebot wurde generiert und heruntergeladen.', nextStep: 'Möchten Sie das automatisieren?', benefits: 'Plattform mit Dienstleistern und echten Preisen.', button: 'Baustelle planen' },
        errors: { resetConfirm: 'Möchten Sie den Verlauf wirklich löschen?', generateError: 'Angebot konnte nicht erstellt werden. ' }
    },
    nl: {
        header: { title: 'AI Architect', subtitle: 'Slimme Assistent', clearTooltip: 'Gesprek wissen' },
        emptyState: {
            title: 'Hoe kan ik vandaag helpen?', subtitle: 'Ik kan helpen met kostenraming, materialen of planning.',
            suggestions: [
                { title: 'Keuken renovatie', text: 'Ik wil de hele keuken renoveren, kasten en apparaten.' },
                { title: 'Coplete badkamer', text: 'Bad eruit, douche erin, nieuw tegelwerk.' },
                { title: 'Volledige renovatie', text: 'Offerte voor het renoveren van 90m2 appartement.' },
                { title: 'Vloeren en verf', text: 'Nieuwe laminaatvloer en stucen.' }
            ]
        },
        input: { placeholder: 'Beschrijf je project...', analyzingDocs: 'Documenten analyseren... 🧠', transcribing: 'Audio transcriberen...', recordingInfo: 'Opnemen...', keyboardHint: 'Druk Enter om te sturen. Shift+Enter voor nieuwe regel.', analyzingText: 'Analyseren...' },
        panel: { title: 'Projectdata', status: 'In uitvoering', completed: 'Klaar', deepGenTitle: 'Diepe Generatie', deepGenDesc: 'Gedetailleerde opsplitsing (langzamer).' },
        progress: { generatingMsg: '(Gedetailleerde offerte genereren...)', extracting: 'Extraheren...', searching: 'Zoeken...', calculating: 'Berekenen...', generateBtn: 'Offerte Genereren' },
        pdfDownloadCard: { title: 'Offerte Aangemaakt', subtitle: 'Je offerte is gedownload.', nextStep: 'Wil je dit automatiseren?', benefits: 'Sluit direct aan op echte marktprijzen.', button: 'Plan je project' },
        errors: { resetConfirm: 'Weet je zeker dat je het gesprek wilt wissen?', generateError: 'Fout bij genereren offerte. ' }
    },
    ca: {
        header: { title: 'Arquitecte IA', subtitle: 'Assistent Intel·ligent', clearTooltip: 'Esborrar conversa i començar de nou' },
        emptyState: {
            title: 'En què et puc ajudar avui?', subtitle: 'Et puc ajudar a estimar costos, definir materials o planificar.',
            suggestions: [
                { title: 'Reforma de cuina', text: 'Vull reformar la cuina completa, amb canvi de mobles.' },
                { title: 'Bany complet', text: 'Canvi de banyera per plat de dutxa i alicatats.' },
                { title: 'Reforma integral', text: 'Pressupost per reformar un pis complet de 90m2.' },
                { title: 'Terres i pintura', text: 'Necessito canviar el terra a tarima i pintar tot.' }
            ]
        },
        input: { placeholder: 'Descriu el teu projecte...', analyzingDocs: 'Analitzant documents... 🧠', transcribing: 'Transcrivint àudio...', recordingInfo: 'Gravant...', keyboardHint: 'Prem Enter per enviar. Shift + Enter per línia nova.', analyzingText: 'Analitzant...' },
        panel: { title: 'Dades del Projecte', status: 'En curs', completed: 'Completat', deepGenTitle: 'Generació Profunda', deepGenDesc: 'Desglossen per capítols (més lent).' },
        progress: { generatingMsg: '(Generant pressupost detallat...)', extracting: 'Extraient partides...', searching: 'Buscant coincidències...', calculating: 'Calculant totals...', generateBtn: 'Generar Pressupost' },
        pdfDownloadCard: { title: 'Pressupost Creat', subtitle: 'El pressupost s\'ha descarregat correctament.', nextStep: 'Vols automatitzar això o tenir l\'assistent integrat?', benefits: 'Potenciar el control.', button: 'Planifica La Teva Obra' },
        errors: { resetConfirm: 'Segur que vols esborrar la conversa? És irreversible.', generateError: 'No s\'ha pogut generar el pressupost. ' }
    }
};

for (const l of locales) {
    const file = 'src/locales/' + l + '/home.json';
    if (fs.existsSync(file)) {
        let raw = fs.readFileSync(file, 'utf8');
        raw = raw.replace(/^\uFEFF/, '').trim();
        let data = JSON.parse(raw);
        if (!data.basis) data.basis = {};
        data.basis.wizardChat = obj[l];
        fs.writeFileSync(file, JSON.stringify(data, null, 4));
        console.log('Wizard texts added to ' + l);
    }
}
