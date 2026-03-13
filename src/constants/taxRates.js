// ============================================================
// Taux fiscaux et sociaux 2025-2026 — Auto-Entrepreneur France
// Sources: URSSAF, Service-Public, Bpifrance Création
// ============================================================

export const ACTIVITY_TYPES = {
  BIC_VENTES: 'BIC_VENTES',
  BIC_SERVICES: 'BIC_SERVICES',
  BNC: 'BNC',
}

export const ACTIVITY_LABELS = {
  [ACTIVITY_TYPES.BIC_VENTES]: 'BIC — Ventes de marchandises',
  [ACTIVITY_TYPES.BIC_SERVICES]: 'BIC — Prestations de services',
  [ACTIVITY_TYPES.BNC]: 'BNC — Professions libérales',
}

export const ACTIVITY_DESCRIPTIONS = {
  [ACTIVITY_TYPES.BIC_VENTES]:
    'Commerce, achat-revente, fourniture de logement (hors tourisme)',
  [ACTIVITY_TYPES.BIC_SERVICES]:
    'Artisans, agents commerciaux, prestations commerciales',
  [ACTIVITY_TYPES.BNC]:
    'Consultants, freelances, professions libérales (hors CIPAV)',
}

// Cotisations sociales URSSAF (% du CA brut)
export const COTISATIONS_RATES = {
  2025: {
    [ACTIVITY_TYPES.BIC_VENTES]: 0.123,
    [ACTIVITY_TYPES.BIC_SERVICES]: 0.212,
    [ACTIVITY_TYPES.BNC]: 0.246,
  },
  2026: {
    [ACTIVITY_TYPES.BIC_VENTES]: 0.123,
    [ACTIVITY_TYPES.BIC_SERVICES]: 0.212,
    [ACTIVITY_TYPES.BNC]: 0.256,
  },
}

// Versement libératoire de l'impôt sur le revenu (% du CA brut, optionnel)
export const VERSEMENT_LIBERATOIRE_RATES = {
  [ACTIVITY_TYPES.BIC_VENTES]: 0.01,
  [ACTIVITY_TYPES.BIC_SERVICES]: 0.017,
  [ACTIVITY_TYPES.BNC]: 0.022,
}

// Abattements forfaitaires pour l'impôt sur le revenu (régime classique)
export const ABATTEMENTS = {
  [ACTIVITY_TYPES.BIC_VENTES]: 0.71,
  [ACTIVITY_TYPES.BIC_SERVICES]: 0.5,
  [ACTIVITY_TYPES.BNC]: 0.34,
  MIN: 305,
}

// Plafonds de chiffre d'affaires (micro-entreprise)
export const CA_PLAFONDS = {
  2025: {
    [ACTIVITY_TYPES.BIC_VENTES]: 188700,
    [ACTIVITY_TYPES.BIC_SERVICES]: 77700,
    [ACTIVITY_TYPES.BNC]: 77700,
  },
  2026: {
    [ACTIVITY_TYPES.BIC_VENTES]: 203100,
    [ACTIVITY_TYPES.BIC_SERVICES]: 83600,
    [ACTIVITY_TYPES.BNC]: 83600,
  },
}

// Seuils TVA — franchise en base (article 293 B du CGI)
export const TVA_SEUILS = {
  [ACTIVITY_TYPES.BIC_VENTES]: {
    franchise: 85000,
    majore: 93500,
  },
  [ACTIVITY_TYPES.BIC_SERVICES]: {
    franchise: 37500,
    majore: 41250,
  },
  [ACTIVITY_TYPES.BNC]: {
    franchise: 37500,
    majore: 41250,
  },
}

// Taux TVA standards en France
export const TVA_RATES = [0.2, 0.1, 0.055, 0.021]
export const TVA_LABELS = {
  0.2: '20% — Taux normal',
  0.1: '10% — Taux intermédiaire',
  0.055: '5,5% — Taux réduit',
  0.021: '2,1% — Taux super-réduit',
}

// ACRE — Aide à la Création ou Reprise d'Entreprise
export const ACRE = {
  reduction_avant_juillet_2026: 0.5, // 50% de réduction
  reduction_apres_juillet_2026: 0.25, // 25% de réduction
  duree_mois: 12,
}

// CFE — Cotisation Foncière des Entreprises
export const CFE = {
  exemption_annee_1: true,
  exemption_ca_inferieur: 5000,
  base_minimum_indicative: { min: 227, max: 7349 }, // dépend de la commune
}

// Tranche marginale d'imposition (barème 2025 sur revenus 2024)
export const TRANCHES_IR = [
  { plafond: 11497, taux: 0 },
  { plafond: 29315, taux: 0.11 },
  { plafond: 83823, taux: 0.3 },
  { plafond: 180294, taux: 0.41 },
  { plafond: Infinity, taux: 0.45 },
]

// Contribution Formation Professionnelle (CFP) incluse dans cotisations ci-dessus
// Taxe pour frais de Chambre (TC) incluse selon l'activité
