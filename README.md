# AI Course Builder — Micro-SaaS de création de formations

> **« Créez vos formations en 10 minutes »** — outil gratuit de génération de plans de formation + rédaction sur mesure par IA.

**Live :** https://dembis91-940.github.io/ai-course-builder/ (GitHub Pages)

## Business model

| Élément | Détail |
|---|---|
| **Cible** | Formateurs, coachs, indépendants, créateurs de contenu qui veulent lancer une formation sans savoir la structurer ni la rédiger |
| **Problème** | Structurer un plan pédagogique prend 2 jours ; rédiger une formation complète prend des semaines. La plupart abandonnent avant de lancer |
| **Solution** | 1) Générateur de plans gratuit et instantané (moteur de templates intelligent, déterministe, 100 % local) 2) Rédaction complète par IA, livrée sous 48-72 h |
| **Prix** | Outil gratuit illimité · Formation rédigée 49-97 € · Pack Studio (5 formations) 197 € |
| **Marge** | ~95 % (rédaction IA automatisée, hébergement statique gratuit, EmailJS gratuit) |
| **Canal** | SEO (« générateur de plan de formation »), LinkedIn/X (formateurs, coachs), bouche-à-oreille des clients, partenariats avec coachs |

## Pages

| Fichier | Rôle |
|---|---|
| `index.html` | Landing immersive 3D (Three.js, parallaxe, particules violettes) : hero « Créez vos formations en 10 minutes », bénéfices, étapes, 3 offres, FAQ |
| `builder.html` | **L'outil réel** : brief (sujet, cible, format, durée, niveau) → plan complet généré en local (modules, leçons, exemples, exercices, évaluation, checklist de livraison, page de vente, séquence email) + export Markdown + impression PDF + bouton « Commander la formation rédigée » (EmailJS) |
| `vente.html` | Page de vente : 3 offres, tunnel de commande EmailJS, garantie 14 jours, FAQ |
| `assets/js/generator.js` | Moteur de génération : 10 banques thématiques (IA, commerce, marketing, management, finance, santé, communication, éducation, juridique, créatif), détection d'audience (pro/équipe/dirigeant/étudiant/public), 4 formats (PDF/e-learning/atelier/bootcamp), 3 niveaux, 3-6 modules selon durée, 8 archétypes pédagogiques |
| `emails/` | Séquence email de 3 messages : confirmation, livraison, upsell (-15 %) |
| `chatbot-config.js` + `chatbot.js` | Chatbot FAQ + capture de leads (EmailJS) |
| `assets/js/voice-config.js` + `voice-widget.js` | Widget vocal intégré (en pause faute de crédits Vapi — à activer en remplissant `assistantId`) |

## Zéro simulateur — preuves

Le moteur `generator.js` est un **vrai outil de structuration** : il produit un plan différent et cohérent selon le sujet, la cible, le format, la durée et le niveau (testé en Node : 12 scénarios, déterminisme vérifié, banques thématiques détectées correctement — y compris la non-détection du faux positif « ia » dans « familial »). Il fonctionne entièrement hors-ligne, sans API, sans coût par génération.

Le tunnel de commande envoie de **vrais emails** via EmailJS (service `service_cy1ytdb`, template `template_xpo58cv`) : chaque commande arrive dans la boîte mail d'El mouskito, qui rédige la formation à la demande (comme les 7 packs existants).

## Déploiement

```bash
cd ~/Documents/livrables/ai-course-builder
git init && git add -A && git commit -m "AI Course Builder"
gh repo create Dembis91-940/ai-course-builder --public --source=. --push
gh api repos/Dembis91-940/ai-course-builder/pages -X POST -f "source[branch]=main" -f "source[path]=/"
```

## Prochaines étapes

1. Stripe live pour le paiement en ligne (virement/DM en attendant)
2. Activation Vapi (crédits) pour le widget vocal
3. Rédaction à la demande : automatiser le processus de rédaction avec un pipeline IA maison
4. Témoignages réels des premiers clients
5. SEO : article « comment structurer une formation » + page d'exemples de plans
