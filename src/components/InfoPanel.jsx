import { useState } from 'react'
import { COTISATIONS_RATES, VERSEMENT_LIBERATOIRE_RATES, ABATTEMENTS,
  CA_PLAFONDS, TVA_SEUILS, ACTIVITY_LABELS } from '../constants/taxRates'

const fmt = (n) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const pct = (n) => `${(n * 100).toFixed(1)}%`

const TABS = ['Cotisations', 'TVA', 'Plafonds', 'ACRE & CFE', 'Calendrier']

export default function InfoPanel() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="card info-panel">
      <h2 className="card-title">Guide fiscal auto-entrepreneur 2025–2026</h2>

      <div className="tabs">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`tab ${activeTab === i ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 0 && (
          <div>
            <p>Les cotisations sont calculées sur le <strong>chiffre d'affaires brut</strong> (sans abattement).</p>
            <table className="info-table">
              <thead>
                <tr><th>Activité</th><th>Taux 2025</th><th>Taux 2026</th><th>Versement lib.</th></tr>
              </thead>
              <tbody>
                {Object.entries(ACTIVITY_LABELS).map(([type, label]) => (
                  <tr key={type}>
                    <td>{label}</td>
                    <td>{pct(COTISATIONS_RATES[2025][type])}</td>
                    <td>{pct(COTISATIONS_RATES[2026][type])}</td>
                    <td>{pct(VERSEMENT_LIBERATOIRE_RATES[type])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="info-note">
              <strong>Versement libératoire :</strong> option permettant de payer l'impôt sur le revenu
              simultanément avec les cotisations, en % fixe du CA. Réservée aux foyers dont le revenu
              fiscal de référence ne dépasse pas 29 315 €/part.
            </p>
            <p className="info-note">
              <strong>Abattements forfaitaires</strong> (régime classique) : BIC Ventes {pct(ABATTEMENTS.BIC_VENTES)},
              BIC Services {pct(ABATTEMENTS.BIC_SERVICES)}, BNC {pct(ABATTEMENTS.BNC)}.
              Minimum {fmt(ABATTEMENTS.MIN)}.
            </p>
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <p>
              Par défaut, les auto-entrepreneurs bénéficient de la <strong>franchise en base de TVA</strong>
              (art. 293 B du CGI) : ils ne facturent pas la TVA et ne la récupèrent pas sur leurs achats.
            </p>
            <table className="info-table">
              <thead>
                <tr><th>Activité</th><th>Seuil franchise</th><th>Seuil majoré</th></tr>
              </thead>
              <tbody>
                {Object.entries(ACTIVITY_LABELS).map(([type, label]) => (
                  <tr key={type}>
                    <td>{label}</td>
                    <td>{fmt(TVA_SEUILS[type].franchise)}</td>
                    <td>{fmt(TVA_SEUILS[type].majore)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="info-list">
              <li><strong>CA &lt; seuil franchise :</strong> franchise appliquée, mention obligatoire sur les factures.</li>
              <li><strong>CA entre les deux seuils :</strong> franchise encore valable cette année, perdue l'an prochain.</li>
              <li><strong>CA &gt; seuil majoré :</strong> TVA due à compter du jour du dépassement (ou du 1er du mois).</li>
            </ul>
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <p>
              Le régime micro-entreprise est maintenu tant que le CA ne dépasse pas ces seuils
              <strong> deux années consécutives</strong>.
            </p>
            <table className="info-table">
              <thead>
                <tr><th>Activité</th><th>Plafond 2025</th><th>Plafond 2026</th></tr>
              </thead>
              <tbody>
                {Object.entries(ACTIVITY_LABELS).map(([type, label]) => (
                  <tr key={type}>
                    <td>{label}</td>
                    <td>{fmt(CA_PLAFONDS[2025][type])}</td>
                    <td>{fmt(CA_PLAFONDS[2026][type])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="info-note">
              En cas d'activité mixte (ventes + services), le total ne doit pas dépasser 203 100 €
              et la part services rester sous 83 600 € (2026).
            </p>
          </div>
        )}

        {activeTab === 3 && (
          <div>
            <h3>ACRE — Aide à la Création ou Reprise d'Entreprise</h3>
            <ul className="info-list">
              <li>Réduction de <strong>50%</strong> sur les cotisations la 1ère année (jusqu'au 30/06/2026)</li>
              <li>Réduction de <strong>25%</strong> à partir du 01/07/2026</li>
              <li>Durée : 12 mois à compter de la date de création</li>
              <li>Condition : ne pas avoir bénéficié de l'ACRE dans les 3 années précédentes</li>
            </ul>
            <h3>CFE — Cotisation Foncière des Entreprises</h3>
            <ul className="info-list">
              <li><strong>1ère année :</strong> exonération totale (déposer le formulaire 1447-C-SD)</li>
              <li><strong>CA &lt; 5 000 € :</strong> exonération permanente</li>
              <li>Montant variable selon la commune (base minimum : ~227 € à 7 349 €)</li>
              <li>Échéance de paiement : <strong>15 décembre</strong></li>
            </ul>
          </div>
        )}

        {activeTab === 4 && (
          <div>
            <h3>Calendrier fiscal & social</h3>
            <table className="info-table">
              <thead>
                <tr><th>Échéance</th><th>Obligation</th></tr>
              </thead>
              <tbody>
                {[
                  ['Mensuelle ou trimestrielle', 'Déclaration et paiement des cotisations URSSAF'],
                  ['30 septembre', 'Demande de versement libératoire pour l\'année suivante'],
                  ['Avril–juin', 'Déclaration annuelle des revenus (impôt sur le revenu)'],
                  ['15 décembre', 'Paiement de la CFE'],
                  ['31 décembre (année création)', 'Dépôt formulaire 1447-C-SD (CFE année 1)'],
                  ['30 jours après création', 'Demande ACRE (à partir du 01/07/2026)'],
                ].map(([date, desc]) => (
                  <tr key={date}>
                    <td><strong>{date}</strong></td>
                    <td>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
