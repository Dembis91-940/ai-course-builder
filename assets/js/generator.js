/* ============================================================
 * AI COURSE BUILDER — Moteur de génération de plans de formation
 * v1.0 — Poseidon / El mouskito Studio
 * ------------------------------------------------------------
 * ZÉRO simulateur : ce moteur produit réellement un plan de
 * formation complet et structuré (modules, leçons, objectifs,
 * exemples, exercices, checklist, page de vente, séquence email).
 * Déterministe : mêmes entrées → même plan. Fonctionne 100 %
 * hors-ligne, sans API, dans le navigateur.
 *
 * API : ACB.generate(input) → plan (objet pur, testable en Node)
 *       ACB.render(plan)     → HTML affichable
 *       ACB.toMarkdown(plan) → export Markdown
 * ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. BANQUES THÉMATIQUES ---------- */
  var BANKS = [
    {
      id: 'ia', mots: ['ia', 'intelligence artificielle', 'chatgpt', 'gpt', 'claude', 'automatisation', 'robot', 'bot', 'agent', 'prompt', 'llm', 'machine learning', 'no-code', 'low-code', 'api', 'donnée', 'data', 'algorithme'],
      competences: ['choisir le bon outil d\u2019IA pour chaque tâche', 'rédiger des prompts qui donnent le bon résultat du premier coup', 'automatiser vos tâches répétitives sans coder', 'intégrer l\u2019IA dans vos process existants', 'évaluer la fiabilité d\u2019une réponse IA', 'protéger vos données lors de l\u2019usage d\u2019outils IA'],
      exemples: ['un commercial qui automatise ses relances et gagne 5 h par semaine', 'un assistant qui rédige ses comptes rendus en 2 minutes au lieu de 30', 'une PME qui traite ses devis 3 fois plus vite', 'un formateur qui prépare ses supports en une heure'],
      outils: ['ChatGPT ou Claude en version pro', 'un outil de no-code type Make ou n8n', 'une bibliothèque de prompts réutilisables', 'un classeur de suivi des automatisations'],
      tendances: ['les agents IA qui exécutent des tâches entières', 'le coût du logiciel qui s\u2019effondre grâce au code généré par IA', 'les modèles multimodaux texte-image-vidéo']
    },
    {
      id: 'commerce', mots: ['vente', 'commerce', 'e-commerce', 'business', 'client', 'clients', 'boutique', 'produit', 'offre', 'négociation', 'prospection', 'conversion', 'tunnel', 'panier'],
      competences: ['construire une offre que les clients comprennent en 5 secondes', 'prospecter sans spammer et obtenir des rendez-vous', 'répondre aux objections sans brader son prix', 'transformer un visiteur en acheteur', 'fidéliser et faire revenir vos clients', 'fixer des prix qui reflètent votre valeur'],
      exemples: ['un indépendant qui double son taux de rendez-vous en un mois', 'une boutique qui passe de 1 à 8 commandes par jour', 'un prestataire qui monte ses prix de 30 % sans perdre un client', 'un e-commerçant qui récupère 20 % de paniers abandonnés'],
      outils: ['une fiche d\u2019offre en une page', 'un script de prospection en 4 étapes', 'un tableau de suivi du tunnel de vente', 'un modèle d\u2019email de relance'],
      tendances: ['les micro-marques qui vendent en direct sans marketplace', 'la vente conversationnelle via messagerie et IA', 'les abonnements qui remplacent l\u2019achat unique']
    },
    {
      id: 'marketing', mots: ['marketing', 'réseau', 'réseaux', 'social media', 'instagram', 'linkedin', 'tiktok', 'publicité', 'pub', 'marque', 'branding', 'contenu', 'seo', 'référencement', 'emailing', 'funnel', 'audience', 'influence'],
      competences: ['définir un positionnement qui vous rend mémorable', 'publier du contenu qui attire votre vraie cible', 'construire une audience sans dépendre d\u2019un algorithme', 'lancer des campagnes qui rapportent plus qu\u2019elles ne coûtent', 'mesurer ce qui compte vraiment (pas les likes)', 'transformer l\u2019attention en clients'],
      exemples: ['un consultant qui passe de 0 à 40 leads par mois sur LinkedIn', 'une marque qui triple son taux d\u2019engagement en 2 mois', 'une petite entreprise qui remplit son agenda avec du contenu local', 'un créateur qui monétise son audience sans brûler ses abonnés'],
      outils: ['un calendrier de contenu sur 4 semaines', 'un modèle de post qui accroche en 3 secondes', 'un tableau de suivi des indicateurs clés', 'un entonnoir de conversion simple en 3 étapes'],
      tendances: ['le contenu authentique qui bat le contenu poli', 'les communautés privées qui remplacent les gros flux', 'la vidéo courte comme porte d\u2019entrée n°1']
    },
    {
      id: 'management', mots: ['management', 'manager', 'équipe', 'équipes', 'leadership', 'recrutement', 'organisation', 'productivité', 'gestion de projet', 'projet', 'délégation', 'réunion', 'performance'],
      competences: ['déléguer sans perdre le contrôle de la qualité', 'animer des réunions qui finissent à l\u2019heure avec des décisions', 'donner un feedback qui fait progresser (pas démotiver)', 'prioriser quand tout est urgent', 'recruter et intégrer sans erreur de casting', 'garder votre équipe motivée sur la durée'],
      exemples: ['un manager qui récupère 8 h par semaine en déléguant mieux', 'une équipe qui livre 30 % plus vite avec les mêmes effectifs', 'un responsable qui réduit de moitié le turnover de son équipe', 'un chef de projet qui arrête le syndrome de l\u2019éternel report'],
      outils: ['une matrice de délégation simple', 'un modèle de compte rendu de réunion', 'une grille d\u2019entretien de feedback', 'un tableau de priorisation en 4 cases'],
      tendances: ['le management à distance et hybride qui s\u2019installe', 'les équipes augmentées par l\u2019IA', 'la prévention du burnout comme priorité de direction']
    },
    {
      id: 'finance', mots: ['finance', 'comptabilité', 'budget', 'investissement', 'trésorerie', 'facturation', 'argent', 'épargne', 'bourse', 'immobilier', 'fiscal', 'impôt', 'revenu', 'rentabilité'],
      competences: ['lire et piloter vos chiffres clés en 30 minutes par mois', 'construire un budget qui tient sur la durée', 'décider où placer votre argent selon votre profil', 'garder une trésorerie saine même en période creuse', 'facturer et encaisser sans délai ni impayé', 'éviter les pièges classiques (frais, crédits, arnaques)'],
      exemples: ['un indépendant qui reprend le contrôle de sa trésorerie en un trimestre', 'un salarié qui passe de 0 à 6 mois d\u2019épargne de sécurité', 'un couple qui rembourse 15 000 € de dettes en 2 ans', 'un entrepreneur qui augmente sa marge de 8 points'],
      outils: ['un tableau de budget mensuel prêt à l\u2019emploi', 'un suivi de trésorerie sur 12 semaines', 'une check-list de décision d\u2019investissement', 'un modèle de relance d\u2019impayés'],
      tendances: ['l\u2019éducation financière qui devient une compétence de survie', 'les applications qui automatisent l\u2019épargne', 'les revenus multiples qui remplacent le salaire unique']
    },
    {
      id: 'sante', mots: ['santé', 'bien-être', 'nutrition', 'alimentation', 'sport', 'sommeil', 'stress', 'coaching', 'soin', 'énergie', 'forme', 'mental'],
      competences: ['construire des habitudes qui tiennent sans volonté héroïque', 'comprendre les bases de votre énergie (sommeil, nutrition, mouvement)', 'gérer le stress au lieu de le subir', 'programmer une pratique sportive réaliste', 'identifier les signaux d\u2019alerte et réagir à temps', 'tenir sur la durée sans effet yoyo'],
      exemples: ['un cadre qui retrouve 2 h d\u2019énergie par jour en 6 semaines', 'une personne qui dort 7 h de qualité pour la première fois depuis des années', 'un parent qui installe une routine sportive de 3 séances par semaine', 'un indépendant qui arrête de travailler épuisé'],
      outils: ['un journal de suivi hebdomadaire', 'une routine matin/soir en 15 minutes', 'un plan de repas simple et flexible', 'un protocole de récupération après une grosse journée'],
      tendances: ['la santé préventive qui remplace la santé curative', 'le sommeil enfin considéré comme une performance', 'les micro-habitudes qui battent les grands régimes']
    },
    {
      id: 'communication', mots: ['communication', 'prise de parole', 'présentation', 'pitch', 'rédaction', 'storytelling', 'confiance', 'orateur', 'discours', 'public', 'interviews', 'réseautage', 'networking'],
      competences: ['structurer un message que l\u2019on retient', 'parler en public sans trembler ni parler trop vite', 'improviser face aux questions difficiles', 'raconter une histoire qui vend ou qui convainc', 'adapter votre discours à votre auditoire', 'répondre avec clarté et sans digression'],
      exemples: ['un entrepreneur qui lève des fonds après un pitch repensé', 'un salarié qui ose enfin prendre la parole en réunion', 'un indépendant qui convertit 3 prospects sur 5 après une démo', 'un auteur qui capte son lecteur dès les 3 premières lignes'],
      outils: ['une trame de pitch en 60 secondes', 'un plan de présentation en 5 actes', 'une banque d\u2019histoires personnelles à réutiliser', 'une check-list de préparation la veille d\u2019une prise de parole'],
      tendances: ['la vidéo courte qui impose un pitch ultra-condensé', 'les podcasts et la parole authentique qui rassurent', 'l\u2019IA qui aide à préparer mais pas à incarner']
    },
    {
      id: 'education', mots: ['formation', 'pédagogie', 'apprendre', 'apprentissage', 'enseigner', 'étudiant', 'étudiants', 'révision', 'mémoire', 'cours', 'scolaire', 'examen', 'compétence'],
      competences: ['apprendre deux fois plus vite avec les bonnes méthodes', 'retenir sur le long terme au lieu de tout oublier en une semaine', 'préparer un examen sans révisions marathon', 'organiser ses cours et ses priorités', 'transmettre ce que vous apprenez (et le maîtriser deux fois mieux)', 'rester motivé quand la matière est difficile'],
      exemples: ['un étudiant qui passe de 12 à 16 de moyenne en un semestre', 'un adulte qui reprend ses études à 35 ans sans y laisser sa vie', 'un formateur qui rend ses apprenants autonomes', 'un lycéen qui apprend ses cours en 2 fois moins de temps'],
      outils: ['une méthode de prise de notes efficace', 'un planning de révision espacée', 'une fiche de révision type', 'un carnet de suivi des acquis'],
      tendances: ['l\u2019apprentissage personnalisé par l\u2019IA', 'les micro-formations qui remplacent les cursus longs', 'la pédagogie active qui remplace le cours magistral']
    },
    {
      id: 'juridique', mots: ['juridique', 'droit', 'contrat', 'conformité', 'rgpd', 'légal', 'réglementation', 'statut', 'société', 'assurance', 'responsabilité', 'propriété intellectuelle'],
      competences: ['choisir le bon statut et la bonne structure pour votre activité', 'rédiger ou vérifier un contrat sans jargon inutile', 'respecter le RGPD quand vous collectez des données', 'protéger votre marque et vos créations', 'anticiper les risques juridiques avant qu\u2019ils ne coûtent cher', 'savoir quand consulter un professionnel (et lesquels)'],
      exemples: ['un freelance qui sécurise ses missions avec un contrat type', 'un e-commerçant qui met ses CGV à jour avant une inspection', 'un créateur qui dépose sa marque avant qu\u2019on ne la lui vole', 'une startup qui sécurise ses données clients dès le premier jour'],
      outils: ['un contrat de prestation commenté', 'une check-list RGPD pour les PME', 'un guide des statuts en 5 pages', 'un registre des traitements de données simple'],
      tendances: ['le RGPD appliqué enfin aux petites structures', 'l\u2019IA qui rédige des contrats (et leurs pièges)', 'la conformité qui devient un argument commercial']
    },
    {
      id: 'creatif', mots: ['design', 'création', 'créatif', 'vidéo', 'photo', 'musique', 'écriture', 'art', 'illustration', 'montage', 'contenu visuel', 'esthétique'],
      competences: ['trouver votre style sans copier les autres', 'produire un travail propre et fini, pas juste une idée', 'construire une routine de création régulière', 'présenter et vendre votre travail', 'utiliser les outils du métier (y compris l\u2019IA) sans en dépendre', 'recevoir un feedback sans vous effondrer'],
      exemples: ['un illustrateur qui passe du hobby au premier client payant', 'un vidéaste qui double sa cadence de publication', 'un écrivain qui termine son premier manuscrit', 'un designer qui construit son portfolio qui fait signer'],
      outils: ['un portfolio d\u2019une page qui vend', 'une routine de création hebdomadaire', 'un brief client type', 'une grille d\u2019auto-évaluation avant livraison'],
      tendances: ['l\u2019IA générative qui change les métiers créatifs', 'les créateurs qui vivent de leur art via les abonnements', 'le « fini vaut mieux que parfait » comme philosophie']
    }
  ];
  var GENERAL = {
    competences: ['maîtriser les fondamentaux de ' + '{sujet}', 'appliquer ' + '{sujet}' + ' dans votre contexte réel', 'éviter les erreurs classiques des débutants', 'construire votre boîte à outils personnelle', 'mesurer vos progrès et ajuster votre pratique', 'passer à l\u2019action dès la fin de la formation'],
    exemples: ['un participant qui applique ' + '{sujet}' + ' dès la première semaine', 'un cas concret tiré d\u2019une situation professionnelle réelle', 'une mise en situation avec ses erreurs et ses corrections', 'un retour d\u2019expérience d\u2019une personne qui a réussi avec ' + '{sujet}'],
    outils: ['une fiche de synthèse par module', 'un tableau de suivi de vos progrès', 'une check-list de mise en pratique', 'un carnet de notes structuré'],
    tendances: ['les nouvelles pratiques qui émergent dans ce domaine', 'les outils numériques qui changent la façon de faire', 'les attentes du marché qui évoluent rapidement']
  };

  function detectBank(sujet, cible) {
    var hay = (sujet + ' ' + cible).toLowerCase();
    var best = null, bestScore = 0;
    for (var i = 0; i < BANKS.length; i++) {
      var score = 0;
      for (var k = 0; k < BANKS[i].mots.length; k++) {
        var kw = BANKS[i].mots[k];
        var re = new RegExp('(^|[^a-zà-ÿ])' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-zà-ÿ]|$)', 'i');
        if (re.test(hay)) score++;
      }
      if (score > bestScore) { bestScore = score; best = BANKS[i]; }
    }
    return best || null;
  }

  /* ---------- 2. ARCHITECTURE PÉDAGOGIQUE ---------- */
  function detectAudience(cible) {
    var c = cible.toLowerCase();
    if (c.indexOf('dirigeant') !== -1 || c.indexOf('patron') !== -1 || c.indexOf('chef d') !== -1 || c.indexOf('fondateur') !== -1 || c.indexOf('startup') !== -1) return 'dirigeant';
    if (c.indexOf('équipe') !== -1 || c.indexOf('entreprise') !== -1 || c.indexOf('collaborateur') !== -1 || c.indexOf('salarié') !== -1 || c.indexOf('employé') !== -1 || c.indexOf('pme') !== -1) return 'equipe';
    if (c.indexOf('professionnel') !== -1 || c.indexOf('indépendant') !== -1 || c.indexOf('freelance') !== -1 || c.indexOf('consultant') !== -1 || c.indexOf('commercial') !== -1 || c.indexOf('manager') !== -1 || c.indexOf('métier') !== -1 || c.indexOf('pro') !== -1) return 'pro';
    if (c.indexOf('étudiant') !== -1 || c.indexOf('élève') !== -1 || c.indexOf('lycéen') !== -1 || c.indexOf('école') !== -1 || c.indexOf('université') !== -1 || c.indexOf('apprenti') !== -1) return 'etudiant';
    if (c.indexOf('débutant') !== -1 || c.indexOf('particulier') !== -1 || c.indexOf('grand public') !== -1 || c.indexOf('tout') !== -1) return 'public';
    return 'pro';
  }

  var AUDIENCE = {
    pro: {
      label: 'Professionnels en activité',
      objectif: 'applicable immédiatement à votre poste et votre secteur',
      exercice: function (sujet) { return 'Appliquez à votre situation professionnelle réelle (poste, mission ou projet en cours) et notez le résultat obtenu.'; },
      prerequis: 'Aucun prérequis technique. Avoir un cas professionnel concret en tête pour les exercices.'
    },
    equipe: {
      label: 'Équipes et entreprises',
      objectif: 'déployable collectivement, avec des rôles et des responsabilités clairs',
      exercice: function (sujet) { return 'Déployez avec votre équipe : définissez qui fait quoi, testez sur un vrai dossier, puis faites un point de 20 minutes sur les résultats.'; },
      prerequis: 'Aucun prérequis. Une réunion de lancement de 30 minutes avec l\u2019équipe est recommandée.'
    },
    dirigeant: {
      label: 'Dirigeants et fondateurs',
      objectif: 'orienté décision et impact business, pas théorie',
      exercice: function (sujet) { return 'Appliquez à une décision que vous devez prendre sous 30 jours : identifiez les 3 actions concrètes et leur impact mesurable.'; },
      prerequis: 'Aucun prérequis. Un enjeu réel de votre entreprise à traiter pendant la formation.'
    },
    etudiant: {
      label: 'Étudiants et apprenants',
      objectif: 'structuré pour la mémorisation et la révision',
      exercice: function (sujet) { return 'Transformez chaque leçon en fiche de révision d\u2019une page, puis reformulez le contenu à voix haute sans regarder vos notes.'; },
      prerequis: 'Aucun prérequis. Un cahier de notes ou une application de prise de notes.'
    },
    public: {
      label: 'Grand public motivé',
      objectif: 'simple, rassurant, centré sur le passage à l\u2019action',
      exercice: function (sujet) { return 'Testez sur un cas concret de votre quotidien, avec un résultat observable dès la première semaine.'; },
      prerequis: 'Aucun prérequis. Curiosité et 30 minutes par jour.'
    }
  };

  var FORMATS = {
    pdf: {
      label: 'Formation PDF',
      style: 'lecture + exercices écrits, à votre rythme',
      supports: ['Support PDF illustré', 'Fiches de synthèse par module', 'Exercices corrigés', 'Checklist de mise en pratique'],
      quiz: 'QCM d\u2019auto-évaluation à la fin de chaque module'
    },
    elearning: {
      label: 'E-learning (vidéos + quiz)',
      style: 'modules courts, vidéos, quiz et progression',
      supports: ['Vidéos de 8-12 minutes par leçon', 'Quiz de validation par module', 'Supports PDF téléchargeables', 'Certificat de fin de parcours'],
      quiz: 'Quiz noté par module + projet final noté'
    },
    atelier: {
      label: 'Atelier en présentiel',
      style: 'pratique de groupe, mises en situation, échanges',
      supports: ['Slides de l\u2019animateur', 'Exercices de groupe et mises en situation', 'Livret participant', 'Feuille d\u2019évaluation à chaud'],
      quiz: 'Mise en situation évaluée en fin d\u2019atelier'
    },
    bootcamp: {
      label: 'Bootcamp intensif',
      style: 'intensif, projet fil rouge, résultats en quelques jours',
      supports: ['Programme jour par jour', 'Projet fil rouge livré en fin de parcours', 'Sessions de coaching courtes', 'Kit de suivi post-bootcamp'],
      quiz: 'Présentation du projet final devant le groupe'
    }
  };

  /* Archétypes de modules : chaque module a un but pédagogique précis */
  var ARCHETYPES = [
    { id: 'fond', titre: 'Les fondamentaux de {sujet}', objectif: 'poser le vocabulaire et les concepts clés, sans jargon inutile', lecons: 4 },
    { id: 'cadre', titre: 'Le cadre de travail : règles, repères et pièges à éviter', objectif: 'installer les bonnes pratiques et les erreurs à ne pas commettre', lecons: 3 },
    { id: 'outils', titre: 'Votre boîte à outils {sujet}', objectif: 'vous équiper des outils, modèles et méthodes du métier', lecons: 4 },
    { id: 'pratique', titre: 'Passer à la pratique', objectif: 'appliquer les concepts sur des cas concrets, guidés pas à pas', lecons: 4 },
    { id: 'cas', titre: 'Cas réels et retours d\u2019expérience', objectif: 'apprendre des situations réelles, réussites comme échecs', lecons: 3 },
    { id: 'projet', titre: 'Projet fil rouge', objectif: 'produire votre livrable personnel tout au long de la formation', lecons: 4 },
    { id: 'mesure', titre: 'Mesurer vos résultats', objectif: 'suivre vos progrès avec des indicateurs simples', lecons: 3 },
    { id: 'action', titre: 'Passer à l\u2019action et tenir sur la durée', objectif: 'transformer l\u2019apprentissage en routine durable', lecons: 3 }
  ];

  var EXO_BANK = [
    'Prenez un cas réel et appliquez la méthode de la leçon de bout en bout, en notant chaque étape.',
    'Rédigez votre propre version de la règle clé de cette leçon, en une phrase que vous pourriez expliquer à un collègue.',
    'Identifiez votre erreur la plus fréquente dans ce domaine et construisez une procédure pour l\u2019éviter.',
    'Interviewez une personne qui pratique déjà ce sujet au quotidien et notez 3 de ses habitudes.',
    'Créez une fiche d\u2019une page qui résume la leçon, puis testez-la sur quelqu\u2019un d\u2019autre.',
    'Refaites l\u2019exemple de la leçon avec vos propres données ou votre propre situation.',
    'Comparez deux approches vues dans la leçon et listez leurs avantages et limites.',
    'Préparez les 3 questions que vous poseriez à un expert sur ce point précis.'
  ];

  var OBJECTIFS_GLOBAUX = [
    'comprendre les mécanismes essentiels de {sujet}',
    'appliquer {sujet} concrètement, dès la fin de la formation',
    'éviter les erreurs coûteuses des débutants',
    'construire une pratique durable et mesurable'
  ];

  /* ---------- 3. GÉNÉRATEUR PRINCIPAL ---------- */
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function titreFormation(sujet, cible, niveau) {
    var base = 'Maîtriser ' + sujet;
    if (niveau === 'debutant') base = 'Les bases de ' + sujet;
    if (niveau === 'avance') base = sujet + ' niveau expert';
    return capitalize(base);
  }

  function fill(tpl, sujet) {
    return tpl.split('{sujet}').join(sujet.toLowerCase());
  }

  function pick(arr, i) { return arr[i % arr.length]; }

  function buildModules(sujet, cible, format, duree, niveau, bank, audience) {
    var nModules = 3;
    if (duree >= 4 && duree < 8) nModules = 4;
    else if (duree >= 8 && duree < 16) nModules = 5;
    else if (duree >= 16) nModules = 6;

    var ids = ['fond', 'cadre', 'outils', 'pratique', 'cas', 'projet', 'mesure', 'action'];
    if (niveau === 'avance') ids = ['cadre', 'outils', 'pratique', 'cas', 'projet', 'mesure', 'action'].slice(0, nModules);
    if (niveau === 'debutant' && nModules > 4) ids = ['fond', 'fond', 'cadre', 'outils', 'pratique', 'cas', 'mesure', 'action'].slice(0, nModules);
    ids = ids.slice(0, nModules);
    if (niveau === 'debutant' && ids[0] !== 'fond') ids[0] = 'fond';

    var comps = (bank ? bank.competences : GENERAL.competences.map(function (c) { return fill(c, sujet); }));
    var exemples = (bank ? bank.exemples : GENERAL.exemples.map(function (c) { return fill(c, sujet); }));
    var outils = (bank ? bank.outils : GENERAL.outils.map(function (c) { return fill(c, sujet); }));
    var tendances = (bank ? bank.tendances : GENERAL.tendances.map(function (c) { return fill(c, sujet); }));
    var fmt = FORMATS[format] || FORMATS.pdf;

    var modules = [];
    for (var m = 0; m < ids.length; m++) {
      var arch = null;
      for (var a = 0; a < ARCHETYPES.length; a++) if (ARCHETYPES[a].id === ids[m]) { arch = ARCHETYPES[a]; break; }
      var nLecons = Math.max(3, arch.lecons);
      if (duree >= 12) nLecons = Math.min(5, nLecons + 1);
      if (ids[m] === 'fond' && ids.filter(function (x) { return x === 'fond'; }).length > 1) {
        arch = { titre: 'Les fondamentaux, deuxième partie : approfondir', objectif: 'aller plus loin sur les concepts essentiels, avec des exemples détaillés', lecons: nLecons };
      }
      var lecons = [];
      for (var l = 0; l < nLecons; l++) {
        var titreL = 'Leçon ' + (l + 1) + ' — ' + pick([
          'Ce qu\u2019il faut savoir avant de commencer',
          'Le concept clé, expliqué simplement',
          'La méthode pas à pas',
          'L\u2019erreur n°1 et comment l\u2019éviter',
          'Les bons réflexes à adopter',
          'Aller plus loin : le niveau supérieur',
          'Le piège du « je le ferai plus tard »',
          'Comment vérifier que vous avez compris'
        ], m + l);
        var obj = fill(pick([
          'comprendre le rôle de ce point dans ' + '{sujet}',
          'savoir reconnaître les situations où ce point s\u2019applique',
          'appliquer ce point sur un cas concret',
          'éviter les erreurs classiques liées à ce point',
          'reformuler ce point avec vos propres mots'
        ], l), sujet);
        var ex = pick(exemples, m + l);
        var exo = AUDIENCE[audience].exercice(sujet) + ' ' + pick(EXO_BANK, m * 3 + l);
        lecons.push({ titre: titreL, objectif: obj, exemple: ex, exercice: exo });
      }
      var objMod = fill(arch.objectif, sujet);
      if (ids[m] === 'projet') objMod = 'construire votre livrable personnel (' + fmt.label.toLowerCase() + ') étape par étape';
      modules.push({ id: arch.id, titre: fill(arch.titre, sujet), objectif: objMod, lecons: lecons });
    }
    return modules;
  }

  function buildChecklist(sujet, format, modules, bank) {
    var fmt = FORMATS[format] || FORMATS.pdf;
    var comps = bank ? bank.competences : GENERAL.competences;
    var outils = bank ? bank.outils : GENERAL.outils;
    var items = [
      'Objectifs pédagogiques rédigés et mesurables (ce que l\u2019apprenant sait faire à la fin)',
      'Plan de ' + fmt.label.toLowerCase() + ' validé (' + modules.length + ' modules, ' + modules.reduce(function (s, m) { return s + m.lecons.length; }, 0) + ' leçons)',
      'Supports produits : ' + fmt.supports.join(', ').toLowerCase(),
      'Exercices et corrigés pour chaque leçon',
      fmt.quiz,
      'Checklist de mise en pratique remise à l\u2019apprenant',
      'Exemples concrets et retours d\u2019expérience intégrés (' + (comps[0] || '') + ')',
      'Boîte à outils fournie : ' + outils.join(', ').toLowerCase(),
      'Page de vente rédigée (titre, promesse, arguments, garantie, CTA)',
      'Séquence email de lancement prête (3 messages)',
      'Test de la formation par 1-2 personnes de la cible avant lancement',
      'Prix fixé et tunnel de commande opérationnel'
    ];
    return items;
  }

  function buildVente(sujet, cible, format, duree, niveau) {
    var promesse = 'À la fin de cette formation, vous ' + fill(OBJECTIFS_GLOBAUX[1], sujet) + ' — avec une méthode claire, des exercices guidés et une checklist de mise en pratique.';
    var titre = titreFormation(sujet, cible, niveau);
    var sousTitre = 'La formation ' + (FORMATS[format] ? FORMATS[format].style : '') + ' pour ' + cible.toLowerCase() + ' — sans jargon, sans blabla, directement applicable.';
    var nMod = 3;
    if (duree >= 4 && duree < 8) nMod = 4;
    else if (duree >= 8 && duree < 16) nMod = 5;
    else if (duree >= 16) nMod = 6;
    var bullets = [
      'Une progression pédagogique en ' + nMod + ' modules validée, du niveau zéro jusqu\u2019à la pratique autonome',
      'Des exercices concrets adaptés à votre profil, avec corrigés',
      'Les erreurs classiques expliquées pour ne pas les commettre',
      'Une boîte à outils et des modèles prêts à l\u2019emploi',
      'Une checklist de mise en pratique pour passer à l\u2019action',
      'Un accès immédiat, à votre rythme, sans engagement'
    ];
    var prixSuggere = 29;
    if (duree >= 8) prixSuggere = 49;
    if (duree >= 16) prixSuggere = 79;
    if (niveau === 'avance') prixSuggere += 18;
    return {
      titre: titre,
      sousTitre: sousTitre,
      promesse: promesse,
      bullets: bullets,
      public: cible,
      format: FORMATS[format] ? FORMATS[format].label : format,
      duree: duree + ' h',
      prixSuggere: prixSuggere,
      garantie: 'Garantie 14 jours satisfait ou remboursé',
      cta: 'Je réserve ma place'
    };
  }

  function buildEmails(sujet, cible, vente) {
    return [
      {
        objet: '✅ Confirmation — votre formation « ' + vente.titre + ' »',
        corps: 'Bonjour,\n\nMerci pour votre commande de la formation « ' + vente.titre + ' ».\n\nVotre accès est en préparation et vous sera envoyé sous 48-72 h ouvrées à cette adresse. Vous recevrez :\n- le support de formation complet (' + vente.format.toLowerCase() + ')\n- les exercices corrigés\n- la checklist de mise en pratique\n\nUne question ? Répondez simplement à cet email.\n\nÀ très vite,\nL\u2019équipe ' + cible + ' — AI Course Builder'
      },
      {
        objet: '📦 Votre formation est livrée — bonne lecture !',
        corps: 'Bonjour,\n\nVotre formation « ' + vente.titre + ' » est prête ! Vous la trouverez en pièce jointe (et à nouveau ci-dessous).\n\nPlan conseillé pour réussir :\n1. Réservez 30 minutes par jour (pas plus, la régularité fait tout)\n2. Faites chaque exercice par écrit\n3. Utilisez la checklist finale pour passer à l\u2019action\n\nNous aimerions beaucoup connaître votre avis : une réponse en 2 lignes nous aide énormément.\n\nBonne formation !\nL\u2019équipe AI Course Builder'
      },
      {
        objet: '🚀 Allez plus loin : votre prochaine formation',
        corps: 'Bonjour,\n\nVous avez terminé (ou presque) « ' + vente.titre + ' » — bravo pour votre engagement !\n\nBeaucoup de nos apprenants enchaînent avec un second sujet pour compléter leur arsenal, et certains nous commandent une formation entièrement personnalisée sur leur métier.\n\nCette semaine, nous offrons 15 % sur toute nouvelle commande (répondez « JE VEUX » à cet email pour en profiter).\n\nÀ très vite,\nL\u2019équipe AI Course Builder'
      }
    ];
  }

  function buildQuiz(sujet, modules) {
    var n = Math.min(10, modules.length * 2);
    var items = [];
    for (var i = 0; i < n; i++) {
      items.push({
        question: 'Question ' + (i + 1) + ' — ' + pick([
          'Quel est l\u2019objectif principal du module « ' + modules[i % modules.length].titre + ' » ?',
          'Citez une erreur classique à éviter dans ' + sujet.toLowerCase() + '.',
          'Quelle est la première action à mener après cette formation ?',
          'Comment vérifier que vous avez bien compris ce point ?',
          'Quel outil ou modèle utiliseriez-vous dans votre contexte ?'
        ], i),
        type: i % 3 === 0 ? 'QCM (4 choix)' : 'Question ouverte'
      });
    }
    return items;
  }

  /* ---------- 4. API PUBLIQUE ---------- */
  function generate(input) {
    var sujet = String(input.sujet || '').trim();
    var cible = String(input.cible || '').trim();
    if (!sujet || !cible) throw new Error('Sujet et cible sont requis.');

    var format = String(input.format || 'pdf').toLowerCase();
    if (!FORMATS[format]) format = 'pdf';
    var niveau = String(input.niveau || 'debutant').toLowerCase();
    if (['debutant', 'intermediaire', 'avance'].indexOf(niveau) === -1) niveau = 'debutant';
    var duree = parseInt(input.duree, 10) || 8;
    if (duree < 1) duree = 1; if (duree > 40) duree = 40;

    var bank = detectBank(sujet, cible);
    var audience = detectAudience(cible);
    var aud = AUDIENCE[audience];
    var fmt = FORMATS[format];

    var modules = buildModules(sujet, cible, format, duree, niveau, bank, audience);
    var vente = buildVente(sujet, cible, format, duree, niveau);
    var emails = buildEmails(sujet, cible, vente);
    var checklist = buildChecklist(sujet, format, modules, bank);
    var quiz = buildQuiz(sujet, modules);
    var comps = (bank ? bank.competences : GENERAL.competences.map(function (c) { return fill(c, sujet); }));

    return {
      meta: {
        sujet: sujet,
        cible: cible,
        format: format,
        formatLabel: fmt.label,
        formatStyle: fmt.style,
        niveau: niveau,
        duree: duree,
        audience: audience,
        audienceLabel: aud.label,
        banque: bank ? bank.id : 'general',
        genereLe: new Date().toISOString().slice(0, 10)
      },
      formation: {
        titre: titreFormation(sujet, cible, niveau),
        promesse: fill(OBJECTIFS_GLOBAUX[0], sujet) + ' et ' + fill(OBJECTIFS_GLOBAUX[1], sujet) + '.',
        public: cible,
        prerequis: aud.prerequis,
        objectifs: OBJECTIFS_GLOBAUX.map(function (o) { return fill(o, sujet); }),
        competences: comps,
        modules: modules,
        quiz: quiz
      },
      checklist: checklist,
      vente: vente,
      emails: emails
    };
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function render(plan) {
    var f = plan.formation;
    var h = '';
    h += '<div class="acb-plan">';
    h += '<h2 class="acb-titre">' + esc(f.titre) + '</h2>';
    h += '<p class="acb-promesse">' + esc(f.promesse) + '</p>';
    h += '<div class="acb-meta">';
    h += '<span>🎯 Public : ' + esc(f.public) + '</span>';
    h += '<span>📐 Format : ' + esc(plan.meta.formatLabel) + '</span>';
    h += '<span>⏱ Durée : ' + esc(plan.meta.duree) + ' h</span>';
    h += '<span>📊 Niveau : ' + esc(plan.meta.niveau) + '</span>';
    h += '</div>';
    h += '<div class="acb-block"><h3>Objectifs pédagogiques</h3><ul>';
    f.objectifs.forEach(function (o) { h += '<li>' + esc(o) + '</li>'; });
    h += '</ul></div>';
    h += '<div class="acb-block"><h3>Compétences développées</h3><ul>';
    f.competences.forEach(function (c) { h += '<li>' + esc(c) + '</li>'; });
    h += '</ul></div>';
    h += '<div class="acb-block"><h3>Prérequis</h3><p>' + esc(f.prerequis) + '</p></div>';
    h += '<h3 class="acb-modules-title">Programme détaillé — ' + f.modules.length + ' modules</h3>';
    f.modules.forEach(function (m, i) {
      h += '<div class="acb-module"><h4>Module ' + (i + 1) + ' — ' + esc(m.titre) + '</h4>';
      h += '<p class="acb-module-obj">Objectif : ' + esc(m.objectif) + '</p>';
      h += '<ol class="acb-lecons">';
      m.lecons.forEach(function (l) {
        h += '<li><strong>' + esc(l.titre) + '</strong><br><span class="acb-l-obj">' + esc(l.objectif) + '</span>';
        h += '<div class="acb-exemple"><em>Exemple :</em> ' + esc(l.exemple) + '</div>';
        h += '<div class="acb-exo"><em>Exercice :</em> ' + esc(l.exercice) + '</div></li>';
      });
      h += '</ol></div>';
    });
    h += '<div class="acb-block"><h3>Évaluation</h3><ul>';
    plan.formation.quiz.forEach(function (q) { h += '<li>' + esc(q.question) + ' <em>(' + esc(q.type) + ')</em></li>'; });
    h += '</ul></div>';
    h += '<div class="acb-block"><h3>Checklist de livraison</h3><ul class="acb-check">';
    plan.checklist.forEach(function (c) { h += '<li><input type="checkbox"> ' + esc(c) + '</li>'; });
    h += '</ul></div>';
    h += '<h3 class="acb-modules-title">Page de vente générée</h3>';
    h += '<div class="acb-block acb-vente"><h4>' + esc(plan.vente.titre) + '</h4>';
    h += '<p class="acb-promesse">' + esc(plan.vente.sousTitre) + '</p>';
    h += '<p>' + esc(plan.vente.promesse) + '</p><ul>';
    plan.vente.bullets.forEach(function (b) { h += '<li>' + esc(b) + '</li>'; });
    h += '</ul><p><strong>Prix conseillé : ' + plan.vente.prixSuggere + ' €</strong> · ' + esc(plan.vente.garantie) + ' · CTA : « ' + esc(plan.vente.cta) + ' »</p></div>';
    h += '<h3 class="acb-modules-title">Séquence email de lancement (3 messages)</h3>';
    plan.emails.forEach(function (e, i) {
      h += '<div class="acb-block acb-email"><h4>Email ' + (i + 1) + ' — ' + esc(e.objet) + '</h4><pre>' + esc(e.corps) + '</pre></div>';
    });
    h += '</div>';
    return h;
  }

  function toMarkdown(plan) {
    var f = plan.formation;
    var md = '# ' + f.titre + '\n\n';
    md += '> ' + f.promesse + '\n\n';
    md += '- **Public** : ' + f.public + '\n';
    md += '- **Format** : ' + plan.meta.formatLabel + ' (' + plan.meta.formatStyle + ')\n';
    md += '- **Durée** : ' + plan.meta.duree + ' h\n';
    md += '- **Prérequis** : ' + f.prerequis + '\n\n';
    md += '## Objectifs pédagogiques\n';
    f.objectifs.forEach(function (o) { md += '- ' + o + '\n'; });
    md += '\n## Compétences développées\n';
    f.competences.forEach(function (c) { md += '- ' + c + '\n'; });
    md += '\n## Programme (' + f.modules.length + ' modules)\n';
    f.modules.forEach(function (m, i) {
      md += '\n### Module ' + (i + 1) + ' — ' + m.titre + '\n';
      md += '_Objectif : ' + m.objectif + '_\n\n';
      m.lecons.forEach(function (l, j) {
        md += '**Leçon ' + (j + 1) + ' — ' + l.titre + '**\n';
        md += '- Objectif : ' + l.objectif + '\n';
        md += '- Exemple : ' + l.exemple + '\n';
        md += '- Exercice : ' + l.exercice + '\n';
      });
    });
    md += '\n## Évaluation\n';
    plan.formation.quiz.forEach(function (q) { md += '- ' + q.question + ' (' + q.type + ')\n'; });
    md += '\n## Checklist de livraison\n';
    plan.checklist.forEach(function (c) { md += '- [ ] ' + c + '\n'; });
    md += '\n## Page de vente\n';
    md += '**' + plan.vente.titre + '**\n\n';
    md += plan.vente.sousTitre + '\n\n';
    md += plan.vente.promesse + '\n\n';
    plan.vente.bullets.forEach(function (b) { md += '- ' + b + '\n'; });
    md += '\nPrix conseillé : ' + plan.vente.prixSuggere + ' € · ' + plan.vente.garantie + ' · CTA : « ' + plan.vente.cta + ' »\n';
    md += '\n## Séquence email (3 messages)\n';
    plan.emails.forEach(function (e, i) {
      md += '\n### Email ' + (i + 1) + ' : ' + e.objet + '\n\n' + e.corps + '\n';
    });
    return md;
  }

  var ACB = { generate: generate, render: render, toMarkdown: toMarkdown, banks: BANKS.length, version: '1.0.0' };
  if (typeof module !== 'undefined' && module.exports) module.exports = ACB;
  if (typeof globalThis !== 'undefined') globalThis.ACB = ACB;
  else if (typeof window !== 'undefined') window.ACB = ACB;
})();
