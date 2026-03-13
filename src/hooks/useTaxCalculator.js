import { useMemo } from 'react'
import {
  ACTIVITY_TYPES,
  COTISATIONS_RATES,
  VERSEMENT_LIBERATOIRE_RATES,
  ABATTEMENTS,
  CA_PLAFONDS,
  TVA_SEUILS,
  TRANCHES_IR,
  ACRE,
} from '../constants/taxRates'

function calculerIRProgressif(revenuImposable) {
  let impot = 0
  let precedent = 0
  for (const tranche of TRANCHES_IR) {
    if (revenuImposable <= precedent) break
    const montantDansLaTranche = Math.min(revenuImposable, tranche.plafond) - precedent
    impot += montantDansLaTranche * tranche.taux
    precedent = tranche.plafond
  }
  return Math.max(0, impot)
}

export function useTaxCalculator({
  ca,
  activityType,
  year,
  versementLiberatoire,
  acreActive,
  autresRevenus,
  quotientFamilial,
  depensesTva,
}) {
  return useMemo(() => {
    const caNum = parseFloat(ca) || 0
    const autresRevenusNum = parseFloat(autresRevenus) || 0
    const quotient = parseFloat(quotientFamilial) || 1

    if (caNum <= 0 || !activityType) {
      return null
    }

    const yearKey = year in COTISATIONS_RATES ? year : 2026
    const plafonds = CA_PLAFONDS[yearKey]
    const tauxCotisations = COTISATIONS_RATES[yearKey][activityType]
    const tvaConfig = TVA_SEUILS[activityType]

    // --- Régime micro : dépassement de plafond ---
    const plafond = plafonds[activityType]
    const depasse_plafond = caNum > plafond

    // --- Cotisations sociales ---
    let tauxEffectif = tauxCotisations
    if (acreActive) {
      tauxEffectif = tauxCotisations * (1 - ACRE.reduction_avant_juillet_2026)
    }
    const cotisations = caNum * tauxEffectif

    // --- TVA status ---
    const tva_franchise = caNum <= tvaConfig.franchise
    const tva_tolerance = caNum > tvaConfig.franchise && caNum <= tvaConfig.majore
    const tva_assujetti = caNum > tvaConfig.majore

    // TVA collectée (si assujetti)
    const tvaCollectee = tva_assujetti ? caNum * 0.2 : 0

    // TVA déductible sur achats (si assujetti)
    const tvaDeductible = tva_assujetti
      ? depensesTva.reduce((acc, d) => {
          const montant = parseFloat(d.montantHT) || 0
          const taux = parseFloat(d.tauxTva) || 0
          return acc + montant * taux
        }, 0)
      : 0

    const tvaNette = tva_assujetti ? Math.max(0, tvaCollectee - tvaDeductible) : 0

    // --- Impôt sur le revenu ---
    let impotRevenu = 0
    let impotRevenuDetail = {}

    if (versementLiberatoire) {
      // Versement libératoire : % fixe sur le CA
      const taux = VERSEMENT_LIBERATOIRE_RATES[activityType]
      impotRevenu = caNum * taux
      impotRevenuDetail = {
        methode: 'versement_liberatoire',
        taux,
        montant: impotRevenu,
      }
    } else {
      // Régime classique : abattement + barème progressif
      const tauxAbattement = ABATTEMENTS[activityType]
      const abattementBrut = caNum * tauxAbattement
      const abattement = Math.max(abattementBrut, ABATTEMENTS.MIN)
      const revenuNetCA = Math.max(0, caNum - abattement)
      const revenuImposableTotal = (revenuNetCA + autresRevenusNum) / quotient
      const impotBrut = calculerIRProgressif(revenuImposableTotal) * quotient
      // Estimation de la part liée au CA (proportionnelle)
      const impotBrutSansCA = calculerIRProgressif(autresRevenusNum / quotient) * quotient
      impotRevenu = Math.max(0, impotBrut - impotBrutSansCA)
      impotRevenuDetail = {
        methode: 'bareme_progressif',
        abattement,
        tauxAbattement,
        revenuNetCA,
        revenuImposableTotal,
        impotBrut,
        impotBrutSansCA,
      }
    }

    // --- Synthèse ---
    const totalPrelevements = cotisations + impotRevenu + tvaNette
    const revenuNet = caNum - totalPrelevements
    const tauxGlobalEffectif = caNum > 0 ? totalPrelevements / caNum : 0

    return {
      ca: caNum,
      plafond,
      depasse_plafond,
      cotisations,
      tauxEffectif,
      tauxCotisations,
      acreActive,
      impotRevenu,
      impotRevenuDetail,
      tva: {
        franchise: tva_franchise,
        tolerance: tva_tolerance,
        assujetti: tva_assujetti,
        seuilFranchise: tvaConfig.franchise,
        seuilMajore: tvaConfig.majore,
        collectee: tvaCollectee,
        deductible: tvaDeductible,
        nette: tvaNette,
      },
      totalPrelevements,
      revenuNet,
      tauxGlobalEffectif,
    }
  }, [ca, activityType, year, versementLiberatoire, acreActive, autresRevenus, quotientFamilial, depensesTva])
}
