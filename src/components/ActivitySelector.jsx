import { ACTIVITY_TYPES, ACTIVITY_LABELS, ACTIVITY_DESCRIPTIONS } from '../constants/taxRates'

export default function ActivitySelector({ value, onChange }) {
  return (
    <div className="card">
      <h2 className="card-title">Type d'activité</h2>
      <div className="activity-grid">
        {Object.values(ACTIVITY_TYPES).map((type) => (
          <button
            key={type}
            className={`activity-btn ${value === type ? 'active' : ''}`}
            onClick={() => onChange(type)}
            type="button"
          >
            <span className="activity-label">{ACTIVITY_LABELS[type]}</span>
            <span className="activity-desc">{ACTIVITY_DESCRIPTIONS[type]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
