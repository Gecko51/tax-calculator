# Simulateur Fiscal Auto-Entrepreneur France

Application web de simulation fiscale et sociale pour les auto-entrepreneurs français, construite avec **Vite + React**. Les données fiscales sont à jour pour 2025 et 2026 (sources : URSSAF, Service-Public.fr, Bpifrance Création).

---

## Table des matières

1. [Aperçu](#aperçu)
2. [Installation et démarrage](#installation-et-démarrage)
3. [Guide d'utilisation](#guide-dutilisation)
   - [Étape 1 — Choisir son type d'activité](#étape-1--choisir-son-type-dactivité)
   - [Étape 2 — Renseigner son chiffre d'affaires](#étape-2--renseigner-son-chiffre-daffaires)
   - [Étape 3 — Lire les résultats](#étape-3--lire-les-résultats)
   - [Étape 4 — Comprendre son statut TVA](#étape-4--comprendre-son-statut-tva)
   - [Étape 5 — Suivre ses achats professionnels](#étape-5--suivre-ses-achats-professionnels)
   - [Étape 6 — Consulter le guide fiscal](#étape-6--consulter-le-guide-fiscal)
4. [Fonctionnalités détaillées](#fonctionnalités-détaillées)
5. [Données fiscales utilisées](#données-fiscales-utilisées)
6. [Architecture technique](#architecture-technique)
7. [Limites et avertissements](#limites-et-avertissements)

---

## Aperçu

Ce simulateur permet à un auto-entrepreneur de :

- **Calculer ses cotisations sociales URSSAF** en fonction de son chiffre d'affaires et de son activité
- **Estimer son impôt sur le revenu** via le barème progressif (avec abattement forfaitaire) ou le versement libératoire
- **Connaître son statut TVA** : franchise en base, zone de tolérance, ou assujettissement
- **Suivre ses achats professionnels** et calculer la TVA déductible si assujetti
- **Simuler l'impact de l'ACRE** (réduction de cotisations la 1ère année)
- **Comparer les années 2025 et 2026** (les taux évoluent notamment pour les BNC)
- **Accéder à un guide fiscal complet** intégré à l'application

---

## Installation et démarrage

### Prérequis

- [Node.js](https://nodejs.org/) version 18 ou supérieure
- npm (inclus avec Node.js)

### Étapes

```bash
# 1. Cloner ou télécharger le projet
cd tax-calculator

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

L'application est accessible à l'adresse **http://localhost:5173** (port par défaut de Vite).

### Autres commandes disponibles

```bash
# Compiler pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

---

## Guide d'utilisation

### Étape 1 — Choisir son type d'activité

La première chose à faire est de sélectionner votre type d'activité parmi les trois options proposées. Ce choix conditionne **tous les taux** appliqués dans le simulateur.

| Option | Correspond à | Exemples |
|--------|-------------|---------|
| **BIC — Ventes de marchandises** | Achat-revente, commerce, fourniture de logement | Boutique en ligne, commerce physique, Airbnb |
| **BIC — Prestations de services** | Artisans, services commerciaux | Plombier, électricien, agent commercial |
| **BNC — Professions libérales** | Activités intellectuelles, libérales (hors CIPAV) | Consultant, développeur freelance, graphiste |

> **Note :** Les professions rattachées à la CIPAV (architectes, ingénieurs conseils, etc.) ont des taux légèrement différents, non couverts par ce simulateur.

---

### Étape 2 — Renseigner son chiffre d'affaires

Une fois l'activité sélectionnée, remplissez le formulaire de paramètres :

#### Chiffre d'affaires annuel
Saisissez votre CA brut annuel en euros (hors TVA si vous êtes assujetti). Une **barre de progression** affiche votre positionnement par rapport au plafond du régime micro-entreprise.

- Barre **verte** : vous êtes bien en dessous du plafond
- Barre **orange** : vous approchez des 80% du plafond — vigilance requise
- Barre **rouge** : vous dépassez le plafond

#### Année fiscale
Choisissez **2025** ou **2026**. Les taux des cotisations BNC et les plafonds de CA sont différents entre les deux années.

#### Autres revenus du foyer
Indiquez la somme des autres revenus de votre foyer fiscal (salaires, retraites, revenus fonciers, etc.). Ce champ est utilisé uniquement si vous utilisez le **barème progressif** (sans versement libératoire) pour estimer votre impôt sur le revenu de manière plus précise.

#### Quotient familial
Sélectionnez le nombre de parts de votre foyer fiscal :
- 1 part = célibataire sans enfant
- 1,5 parts = personne seule avec 1 enfant à charge, ou couple marié/pacsé sans enfant
- 2 parts = couple marié/pacsé sans enfant (mariage/PACS récent) ou personne seule avec 2 enfants
- +0,5 part par enfant supplémentaire à partir du 3ème

#### Option : Versement libératoire
Cochez cette case si vous avez opté pour le **versement libératoire de l'impôt sur le revenu**. Cette option vous permet de payer votre impôt simultanément avec vos cotisations, à un taux fixe sur votre CA.

**Conditions d'éligibilité :**
- Votre revenu fiscal de référence de l'année N-2 ne doit pas dépasser **29 315 € par part** du foyer
- La demande doit être effectuée avant le **30 septembre** de l'année précédente

**Taux du versement libératoire :**
- BIC Ventes : 1,0% du CA
- BIC Services : 1,7% du CA
- BNC : 2,2% du CA

Si vous n'êtes pas éligible ou ne souhaitez pas cette option, le simulateur calcule l'impôt selon le **barème progressif** avec abattement forfaitaire.

#### Option : ACRE (1ère année)
Cochez cette case si vous êtes dans votre **première année d'activité** et avez obtenu l'ACRE (Aide à la Création ou Reprise d'Entreprise). Cette aide réduit vos cotisations sociales de **50%** pendant 12 mois (taux valable jusqu'au 30/06/2026).

---

### Étape 3 — Lire les résultats

La carte **Résultats de la simulation** affiche en temps réel :

#### Cotisations sociales URSSAF
Montant des cotisations sociales calculé sur votre CA brut. Le taux effectif appliqué est affiché (réduit de moitié si ACRE activée).

Ces cotisations couvrent : assurance maladie-maternité, retraite de base et complémentaire, invalidité-décès, allocations familiales, contribution formation professionnelle.

#### Impôt sur le revenu

**Avec versement libératoire :** le montant est un pourcentage fixe de votre CA. Simple et prévisible.

**Sans versement libératoire (barème progressif) :**
1. L'abattement forfaitaire est déduit de votre CA (71% / 50% / 34% selon l'activité, minimum 305 €)
2. Le revenu net obtenu est additionné à vos autres revenus
3. Le total est divisé par votre quotient familial
4. Le barème progressif 2025 est appliqué, puis multiplié par le quotient
5. La part de l'impôt attribuable à votre CA est estimée par soustraction

> L'estimation IR est **indicative** — l'impôt réel dépend de nombreux autres facteurs (crédits d'impôt, déductions, revenus exceptionnels, etc.).

#### TVA nette (si assujetti)
Si votre CA dépasse les seuils TVA, la TVA nette à reverser (collectée moins déductible sur achats) est incluse dans les prélèvements.

#### Total prélèvements et revenu net
Synthèse finale avec le taux global effectif et le revenu net estimé après toutes les charges.

#### Barre de répartition visuelle
Un graphique en barre décompose votre CA entre :
- 🟡 Cotisations sociales
- 🔴 Impôt sur le revenu
- 🟣 TVA nette (si applicable)
- 🟢 Revenu net (solde)

#### Alerte dépassement de plafond
Si votre CA dépasse le plafond du régime micro-entreprise, une alerte rouge apparaît. Rappel : le régime est perdu seulement après **deux années consécutives** de dépassement.

---

### Étape 4 — Comprendre son statut TVA

La carte **Statut TVA** analyse votre situation en trois cas possibles :

#### ✅ Franchise en base de TVA (vert)
Votre CA est inférieur au seuil de franchise. Vous :
- Ne facturez **pas** la TVA à vos clients
- Ne récupérez **pas** la TVA sur vos achats
- Devez obligatoirement mentionner sur chaque facture : **« TVA non applicable, article 293 B du CGI »**

Les seuils de franchise 2025-2026 :
- BIC Ventes : **85 000 €**
- BIC Services et BNC : **37 500 €**

#### ⚠️ Zone de tolérance (orange)
Votre CA est entre le seuil de franchise et le seuil majoré. La franchise s'applique **encore cette année**, mais vous la perdrez au 1er janvier de l'année suivante si vous restez au-dessus. C'est le moment d'anticiper le passage à la TVA.

#### ❌ Assujetti à la TVA (rouge)
Votre CA dépasse le seuil majoré (93 500 € / 41 250 €). Vous devez :
- Facturer la TVA à vos clients
- Déposer des déclarations de TVA périodiques
- Obtenir un numéro de TVA intracommunautaire
- En contrepartie, récupérer la TVA payée sur vos achats professionnels

---

### Étape 5 — Suivre ses achats professionnels

La carte **Suivi des achats professionnels** permet d'enregistrer vos dépenses professionnelles et de calculer la TVA déductible (utile si vous êtes assujetti à la TVA).

#### Ajouter une dépense

Pour chaque achat, renseignez :
1. **Libellé** : description de la dépense (ex : "MacBook Pro", "Adobe Creative Cloud")
2. **Catégorie** : choisissez parmi les catégories prédéfinies (Matériel informatique, Logiciels, Formation, etc.)
3. **Montant HT** : montant hors taxe en euros
4. **Taux TVA** : choisissez le taux applicable
   - 20% — Taux normal (la majorité des biens et services)
   - 10% — Taux intermédiaire (restaurants, travaux, transports)
   - 5,5% — Taux réduit (alimentation, livres, abonnements énergie)
   - 2,1% — Taux super-réduit (médicaments remboursables, presse)

Cliquez sur **+ Ajouter** pour enregistrer la dépense.

#### Tableau récapitulatif
Toutes les dépenses s'affichent dans un tableau avec le montant HT, la TVA calculée et le montant TTC.

#### Totaux
- **Total HT** : somme de vos achats hors taxe
- **TVA déductible** : total de TVA récupérable (affiché uniquement si vous êtes assujetti)
- **Total TTC payé** : montant réellement sorti de votre trésorerie

> Si vous êtes en franchise de TVA, un message vous informe que vous ne pouvez pas déduire la TVA, mais vous pouvez quand même utiliser cet outil pour suivre vos dépenses.

---

### Étape 6 — Consulter le guide fiscal

La carte **Guide fiscal auto-entrepreneur 2025–2026** contient toutes les informations de référence, organisées en 5 onglets :

| Onglet | Contenu |
|--------|---------|
| **Cotisations** | Tableau comparatif des taux 2025/2026, taux du versement libératoire, abattements forfaitaires |
| **TVA** | Explication du mécanisme de franchise, seuils par activité, conséquences de chaque situation |
| **Plafonds** | Seuils de CA pour rester dans le régime micro-entreprise, règles en cas d'activité mixte |
| **ACRE & CFE** | Conditions et taux de l'ACRE, règles d'exonération de la CFE, montants indicatifs |
| **Calendrier** | Toutes les échéances fiscales et sociales de l'année |

---

## Fonctionnalités détaillées

### Calcul des cotisations sociales

```
Cotisations = CA × taux_cotisations × (1 - réduction_ACRE)
```

Les cotisations sont toujours calculées sur le **CA brut**, sans aucun abattement. Elles sont dues même si vous ne vous versez pas de salaire.

### Calcul de l'impôt sur le revenu — barème progressif

```
Abattement = max(CA × taux_abattement, 305 €)
Revenu_net_CA = CA - Abattement
Revenu_imposable_total = (Revenu_net_CA + Autres_revenus) / Quotient_familial
Impôt_brut = barème_progressif(Revenu_imposable_total) × Quotient_familial
IR_attribuable_CA = Impôt_brut - barème_progressif(Autres_revenus / QF) × QF
```

### Barème progressif 2025 (revenus 2024)

| Tranche | Taux |
|---------|------|
| Jusqu'à 11 497 € | 0% |
| De 11 497 € à 29 315 € | 11% |
| De 29 315 € à 83 823 € | 30% |
| De 83 823 € à 180 294 € | 41% |
| Au-delà de 180 294 € | 45% |

### Calcul de la TVA nette (si assujetti)

```
TVA_collectée = CA × taux_TVA_vente (20% par défaut)
TVA_déductible = Σ (Montant_HT_achat × taux_TVA_achat)
TVA_nette = max(0, TVA_collectée - TVA_déductible)
```

---

## Données fiscales utilisées

| Donnée | Valeur | Source |
|--------|--------|--------|
| Cotisations BIC Ventes 2025-2026 | 12,3% | URSSAF |
| Cotisations BIC Services 2025-2026 | 21,2% | URSSAF |
| Cotisations BNC 2025 | 24,6% | URSSAF |
| Cotisations BNC 2026 | 25,6% | URSSAF |
| Versement libératoire BIC Ventes | 1,0% | art. 151-0 CGI |
| Versement libératoire BIC Services | 1,7% | art. 151-0 CGI |
| Versement libératoire BNC | 2,2% | art. 151-0 CGI |
| Abattement BIC Ventes | 71% | art. 50-0 CGI |
| Abattement BIC Services | 50% | art. 50-0 CGI |
| Abattement BNC | 34% | art. 102 ter CGI |
| Plafond micro BIC Ventes 2026 | 203 100 € | Bpifrance / URSSAF |
| Plafond micro BIC Services / BNC 2026 | 83 600 € | Bpifrance / URSSAF |
| Seuil TVA franchise ventes | 85 000 € | art. 293 B CGI |
| Seuil TVA franchise services | 37 500 € | art. 293 B CGI |
| Seuil TVA majoré ventes | 93 500 € | art. 293 B CGI |
| Seuil TVA majoré services | 41 250 € | art. 293 B CGI |
| ACRE réduction | 50% (avant 07/2026) | Décret 2024 |
| CFE exemption CA < | 5 000 € | CGI |

---

## Architecture technique

```
tax-calculator/
├── index.html                        # Point d'entrée HTML
├── vite.config.js                    # Configuration Vite
├── package.json
└── src/
    ├── main.jsx                      # Montage React (StrictMode)
    ├── App.jsx                       # Composant racine, gestion de l'état global
    ├── constants/
    │   └── taxRates.js               # Toutes les constantes fiscales 2025/2026
    ├── hooks/
    │   └── useTaxCalculator.js       # Logique de calcul (hook React personnalisé)
    ├── components/
    │   ├── ActivitySelector.jsx      # Sélection du type d'activité
    │   ├── RevenueInput.jsx          # Saisie CA, options, paramètres IR
    │   ├── TaxResults.jsx            # Affichage des résultats et graphique
    │   ├── TvaStatus.jsx             # Diagnostic et statut TVA
    │   ├── ExpenseTracker.jsx        # Saisie et suivi des achats
    │   └── InfoPanel.jsx             # Guide fiscal avec onglets
    └── styles/
        └── index.css                 # Styles globaux (CSS pur, sans framework)
```

### Choix techniques

- **Vite** : serveur de développement ultra-rapide, bundling optimisé pour la production
- **React 18** : composants fonctionnels, hooks natifs (`useState`, `useMemo`)
- **Pas de bibliothèque UI externe** : CSS pur avec variables custom properties pour un contrôle total et un bundle minimal
- **`useMemo`** dans le hook de calcul : les calculs fiscaux ne sont recalculés que si les entrées changent, évitant les re-renders inutiles
- **Séparation constantes / logique / UI** : modifier un taux fiscal ne nécessite de toucher qu'à `taxRates.js`

---

## Limites et avertissements

> ⚠️ **Ce simulateur est un outil d'estimation indicative.** Il ne remplace pas le conseil d'un expert-comptable ou d'un conseiller fiscal.

**Cas non couverts par ce simulateur :**
- Professions libérales rattachées à la **CIPAV** (architectes, ingénieurs conseils, ostéopathes, etc.) dont les taux diffèrent
- **Activités mixtes** ventes + services (des règles spécifiques de plafond s'appliquent)
- **Locations meublées de tourisme** (classées ou non classées, dont les règles ont changé en 2025)
- **Micro-BIC location** (LMNP en micro)
- Crédits et réductions d'impôt (crédit d'impôt pour la formation du dirigeant, etc.)
- Exonérations géographiques (ZFU, ZRR, etc.)
- Impact de la **cotisation subsidiaire maladie** (CSM) si vous avez d'autres revenus d'activité importants
- **Taxe pour frais de Chambre** (TFC) applicable aux artisans inscrits au RM

**L'impôt sur le revenu affiché est une estimation** basée sur le seul mécanisme de l'abattement et du barème. Le calcul réel de l'IR prend en compte de nombreux autres paramètres du foyer fiscal.
