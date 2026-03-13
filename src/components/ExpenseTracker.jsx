import { useState } from 'react'
import { TVA_RATES, TVA_LABELS } from '../constants/taxRates'

const fmt = (n) =>
  typeof n === 'number'
    ? n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 })
    : '—'

const CATEGORIES = [
  'Matériel informatique',
  'Logiciels / abonnements',
  'Fournitures de bureau',
  'Déplacements / carburant',
  'Formation',
  'Communication / marketing',
  'Loyer professionnel',
  'Sous-traitance',
  'Autre',
]

export default function ExpenseTracker({ depenses, onDepensesChange, tvaAssujetti }) {
  const [form, setForm] = useState({
    libelle: '',
    categorie: CATEGORIES[0],
    montantHT: '',
    tauxTva: 0.2,
  })

  const addDepense = () => {
    if (!form.libelle || !form.montantHT) return
    onDepensesChange([...depenses, { ...form, id: Date.now() }])
    setForm({ libelle: '', categorie: CATEGORIES[0], montantHT: '', tauxTva: 0.2 })
  }

  const removeDepense = (id) => {
    onDepensesChange(depenses.filter((d) => d.id !== id))
  }

  const totalHT = depenses.reduce((acc, d) => acc + (parseFloat(d.montantHT) || 0), 0)
  const totalTva = depenses.reduce(
    (acc, d) => acc + (parseFloat(d.montantHT) || 0) * (parseFloat(d.tauxTva) || 0),
    0
  )
  const totalTTC = totalHT + totalTva

  return (
    <div className="card">
      <h2 className="card-title">
        Suivi des achats professionnels
        {tvaAssujetti && <span className="badge-tva-droit">TVA déductible</span>}
      </h2>

      {!tvaAssujetti && (
        <div className="alert alert-info">
          ℹ️ Vous êtes en franchise de TVA : vous ne pouvez pas déduire la TVA sur vos achats.
          Cet outil vous permet toutefois de suivre vos dépenses professionnelles.
        </div>
      )}

      <div className="expense-form">
        <input
          type="text"
          className="input"
          placeholder="Libellé de la dépense"
          value={form.libelle}
          onChange={(e) => setForm({ ...form, libelle: e.target.value })}
        />
        <select
          className="input"
          value={form.categorie}
          onChange={(e) => setForm({ ...form, categorie: e.target.value })}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="number"
          className="input"
          placeholder="Montant HT (€)"
          value={form.montantHT}
          min={0}
          step={0.01}
          onChange={(e) => setForm({ ...form, montantHT: e.target.value })}
        />
        <select
          className="input"
          value={form.tauxTva}
          onChange={(e) => setForm({ ...form, tauxTva: parseFloat(e.target.value) })}
        >
          {TVA_RATES.map((t) => (
            <option key={t} value={t}>{TVA_LABELS[t]}</option>
          ))}
        </select>
        <button className="btn btn-add" onClick={addDepense} type="button">
          + Ajouter
        </button>
      </div>

      {depenses.length > 0 && (
        <>
          <div className="expense-table-wrapper">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Libellé</th>
                  <th>Catégorie</th>
                  <th>Montant HT</th>
                  <th>TVA</th>
                  <th>TTC</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {depenses.map((d) => {
                  const ht = parseFloat(d.montantHT) || 0
                  const tva = ht * (parseFloat(d.tauxTva) || 0)
                  return (
                    <tr key={d.id}>
                      <td>{d.libelle}</td>
                      <td>{d.categorie}</td>
                      <td>{fmt(ht)}</td>
                      <td>{fmt(tva)} ({(d.tauxTva * 100).toFixed(0)}%)</td>
                      <td>{fmt(ht + tva)}</td>
                      <td>
                        <button
                          className="btn-remove"
                          onClick={() => removeDepense(d.id)}
                          type="button"
                          aria-label="Supprimer"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="expense-totals">
            <div className="total-row">
              <span>Total HT</span><strong>{fmt(totalHT)}</strong>
            </div>
            {tvaAssujetti && (
              <div className="total-row total-tva">
                <span>TVA déductible</span><strong>{fmt(totalTva)}</strong>
              </div>
            )}
            <div className="total-row total-ttc">
              <span>Total TTC payé</span><strong>{fmt(totalTTC)}</strong>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
