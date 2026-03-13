import { CA_PLAFONDS } from '../constants/taxRates'

const fmt = (n) =>
  n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

export default function RevenueInput({
  ca, onCaChange,
  year, onYearChange,
  activityType,
  versementLiberatoire, onVersementChange,
  acreActive, onAcreChange,
  autresRevenus, onAutresRevenusChange,
  quotientFamilial, onQuotientChange,
}) {
  const plafond = activityType ? CA_PLAFONDS[year]?.[activityType] : null
  const progress = plafond && ca > 0 ? Math.min((parseFloat(ca) / plafond) * 100, 100) : 0
  const caNum = parseFloat(ca) || 0

  return (
    <div className="card">
      <h2 className="card-title">Chiffre d'affaires & paramètres</h2>

      <div className="form-row">
        <div className="form-group">
          <label className="label" htmlFor="ca">Chiffre d'affaires annuel (€)</label>
          <input
            id="ca"
            type="number"
            className="input"
            value={ca}
            onChange={(e) => onCaChange(e.target.value)}
            placeholder="Ex : 45 000"
            min={0}
            step={100}
          />
          {plafond && (
            <div className="progress-wrapper">
              <div className="progress-bar">
                <div
                  className={`progress-fill ${progress >= 100 ? 'danger' : progress >= 80 ? 'warning' : ''}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="progress-label">
                {caNum > 0
                  ? `${fmt(caNum)} / ${fmt(plafond)} — ${progress.toFixed(1)}% du plafond`
                  : `Plafond : ${fmt(plafond)}`}
              </span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="year">Année fiscale</label>
          <select
            id="year"
            className="input"
            value={year}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="label" htmlFor="autres">Autres revenus du foyer (€)</label>
          <input
            id="autres"
            type="number"
            className="input"
            value={autresRevenus}
            onChange={(e) => onAutresRevenusChange(e.target.value)}
            placeholder="Salaires, retraites…"
            min={0}
          />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="quotient">Quotient familial (parts)</label>
          <select
            id="quotient"
            className="input"
            value={quotientFamilial}
            onChange={(e) => onQuotientChange(e.target.value)}
          >
            {[1, 1.5, 2, 2.5, 3, 3.5, 4].map((q) => (
              <option key={q} value={q}>{q} part{q > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="toggles-row">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={versementLiberatoire}
            onChange={(e) => onVersementChange(e.target.checked)}
          />
          <span className="toggle-text">
            <strong>Versement libératoire</strong>
            <small>Impôt payé en % fixe du CA (optionnel)</small>
          </span>
        </label>

        <label className="toggle-label">
          <input
            type="checkbox"
            checked={acreActive}
            onChange={(e) => onAcreChange(e.target.checked)}
          />
          <span className="toggle-text">
            <strong>ACRE (1ère année)</strong>
            <small>Réduction de 50% sur les cotisations</small>
          </span>
        </label>
      </div>
    </div>
  )
}
