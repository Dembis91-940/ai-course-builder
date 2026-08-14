/* Test Node du moteur ACB — vérifie le déterminisme et la structure réelle */
const fs = require('fs');
const path = require('path');
const dir = process.argv[2] || __dirname;
const ACB = require(path.resolve(dir, 'assets/js/generator.js'));

let failures = 0;
function check(name, cond) {
  if (cond) { console.log('  ✓ ' + name); }
  else { failures++; console.log('  ✗ FAIL ' + name); }
}

// 1. Déterminisme : mêmes entrées → mêmes sorties
const input = { sujet: 'IA pour les commerciaux', cible: 'commerciaux en entreprise', format: 'pdf', duree: 12, niveau: 'intermediaire' };
const p1 = ACB.generate(input);
const p2 = ACB.generate(input);
check('déterminisme (2 générations identiques)', JSON.stringify(p1) === JSON.stringify(p2));

// 2. Structure complète
check('plan a formation', !!p1.formation);
check('plan a checklist', Array.isArray(p1.checklist) && p1.checklist.length >= 10);
check('plan a vente', !!p1.vente && typeof p1.vente.prixSuggere === 'number');
check('plan a emails (3)', Array.isArray(p1.emails) && p1.emails.length === 3);
check('modules 3-6 selon durée (12h → 5)', p1.formation.modules.length === 5);
check('chaque module a des leçons', p1.formation.modules.every(m => m.lecons.length >= 3));
check('chaque leçon a titre/objectif/exemple/exercice', p1.formation.modules.every(m => m.lecons.every(l => l.titre && l.objectif && l.exemple && l.exercice)));
check('quiz présent', Array.isArray(p1.formation.quiz) && p1.formation.quiz.length > 0);

// 3. Banque détectée (IA)
check('banque IA détectée', p1.meta.banque === 'ia');
// Faux positif : « familial » ne doit pas matcher la banque IA
const pFam = ACB.generate({ sujet: 'Gestion familiale', cible: 'particuliers', format: 'pdf', duree: 4, niveau: 'debutant' });
check('pas de faux positif "ia" dans "familiale"', pFam.meta.banque !== 'ia');

// 4. Durées extrêmes
const pCourt = ACB.generate({ sujet: 'Excel', cible: 'assistantes', format: 'atelier', duree: 2, niveau: 'debutant' });
check('durée 2h → 3 modules', pCourt.formation.modules.length === 3);
const pLong = ACB.generate({ sujet: 'Data science', cible: 'étudiants en école', format: 'elearning', duree: 30, niveau: 'avance' });
check('durée 30h avancé → 6 modules', pLong.formation.modules.length === 6);
check('format e-learning appliqué', pLong.meta.formatLabel.indexOf('E-learning') !== -1);
check('audience étudiant détectée', pLong.meta.audience === 'etudiant');

// 5. Niveau débutant → 1er module = fondamentaux
check('niveau débutant commence par fondamentaux', pCourt.formation.modules[0].titre.toLowerCase().indexOf('fondament') !== -1);

// 6. Erreur si entrées manquantes
let threw = false;
try { ACB.generate({ sujet: '' }); } catch (e) { threw = true; }
check('erreur si sujet vide', threw);

// 7. Render produit du HTML avec les éléments clés
const html = ACB.render(p1);
check('render contient titre', html.indexOf(p1.formation.titre) !== -1);
check('render contient checklist cochable', html.indexOf('type="checkbox"') !== -1);
check('render contient emails', html.indexOf('Email 1') !== -1);

// 8. Markdown exportable
const md = ACB.toMarkdown(p1);
check('markdown contient titre + modules', md.indexOf('# ' + p1.formation.titre) !== -1 && md.indexOf('### Module 1') !== -1);
check('markdown contient checklist cochable', md.indexOf('- [ ]') !== -1);

console.log(failures === 0 ? '\n✅ TOUS LES TESTS PASSENT' : '\n❌ ' + failures + ' TEST(S) EN ÉCHEC');
process.exit(failures === 0 ? 0 : 1);
