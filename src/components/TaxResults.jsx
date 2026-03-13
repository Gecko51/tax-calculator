const fmt = (n) =>
  typeof n === 'number'
    ? n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
    : '—'

const pct = (n) => (typeof n === 'number' ? `${(n * 100).toFixed(1)}%` : '—')

function ResultRow({ label, value, highlight, sub }) {
  return (
    <div className={`result-row ${highlight ? 'highlight' : ''}`}>
      <span className="result-label">{label}</span>
      <div className="result-right">
        <span className="result-value">{value}</span>
        {sub && <span className="result-sub">{sub}</span>}
      </div>
    </div>
  )
}

export default function TaxResults({ result, versementLiberatoire }) {
  if (!result) {
    return (
      <div className="card card-empty">
        <p>Remplissez les champs pour voir votre simulation.</p>
      </div>
    )
  }

  const { ca, cotisations, tauxEffectif, impotRevenu, impotRevenuDetail,
    totalPrelevements, revenuNet, tauxGlobalEffectif, depasse_plafond, plafond } = result

  return (
    <div className="card">
      <h2 className="card-title">Résultats de la simulation</h2>

      {depasse_plafond && (
        <div className="alert alert-danger">
          ⚠️ Votre CA ({fmt(ca)}) dépasse le plafond du régime micro-entreprise ({fmt(plafond)}).
          Vous sortirez du régime à la fin de la 2ème année consécutive de dépassement.
        </div>
      )}

      <div className="results-section">
        <h3 className="section-title">Cotisations sociales URSSAF</h3>
        <ResultRow
          label="Cotisations sociales"
          value={fmt(cotisations)}
          sub={`${pct(tauxEffectif)} du CA${result.acreActive ? ' (avec ACRE −50%)' : ''}`}
        />
      </div>

      <div className="results-section">
        <h3 className="section-title">Impôt sur le revenu</h3>
        {versementLiberatoire ? (
          <ResultRow
            label="Versement libératoire"
            value={fmt(impotRevenu)}
            sub={`${pct(impotRevenuDetail.taux)} du CA`}
          />
        ) : (
          <>
            <ResultRow
              label={`Abattement forfaitaire (${pct(impotRevenuDetail.tauxAbattement)})`}
              value={`− ${fmt(impotRevenuDetail.abattement)}`}
            />
            <ResultRow
              label="Revenu net imposable (part CA)"
              value={fmt(impotRevenuDetail.revenuNetCA)}
            />
            <ResultRow
              label="Estimation IR (barème progressif)"
              value={fmt(impotRevenu)}
              sub="Estimation indicative"
            />
          </>
        )}
      </div>

      {result.tva.assujetti && (
        <div className="results-section">
          <h3 className="section-title">TVA</h3>
          <ResultRow label="TVA collectée (20%)" value={fmt(result.tva.collectee)} />
          <ResultRow label="TVA déductible (achats)" value={`− ${fmt(result.tva.deductible)}`} />
          <ResultRow label="TVA nette à reverser" value={fmt(result.tva.nette)} highlight />
        </div>
      )}

      <div className="results-section results-total">
        <ResultRow
          label="Total prélèvements"
          value={fmt(totalPrelevements)}
          sub={`${pct(tauxGlobalEffectif)} du CA`}
          highlight
        />
        <ResultRow
          label="Revenu net estimé"
          value={fmt(revenuNet)}
          highlight
        />
      </div>

      <div className="breakdown-chart">
        <div className="breakdown-bar">
          <div
            className="breakdown-segment seg-cotisations"
            style={{ width: `${(cotisations / ca) * 100}%` }}
            title={`Cotisations : ${fmt(cotisations)}`}
          />
          <div
            className="breakdown-segment seg-ir"
            style={{ width: `${(impotRevenu / ca) * 100}%` }}
            title={`IR : ${fmt(impotRevenu)}`}
          />
          {result.tva.assujetti && (
            <div
              className="breakdown-segment seg-tva"
              style={{ width: `${(result.tva.nette / ca) * 100}%` }}
              title={`TVA nette : ${fmt(result.tva.nette)}`}
            />
          )}
        </div>
        <div className="breakdown-legend">
          <span className="legend-item"><span className="dot seg-cotisations" />Cotisations</span>
          <span className="legend-item"><span className="dot seg-ir" />Impôt sur le revenu</span>
          {result.tva.assujetti && (
            <span className="legend-item"><span className="dot seg-tva" />TVA nette</span>
          )}
          <span className="legend-item"><span className="dot seg-net" />Revenu net</span>
        </div>
      </div>
    </div>
  )
}
