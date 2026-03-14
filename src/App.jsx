import { useState, useRef } from 'react'
import { useTaxCalculator } from './hooks/useTaxCalculator'
import ActivitySelector from './components/ActivitySelector'
import RevenueInput from './components/RevenueInput'
import TaxResults from './components/TaxResults'
import TvaStatus from './components/TvaStatus'
import ExpenseTracker from './components/ExpenseTracker'
import InfoPanel from './components/InfoPanel'
import DownloadPdfButton from './components/DownloadPdfButton'

export default function App() {
  const [activityType, setActivityType] = useState(null)
  const [ca, setCa] = useState('')
  const [year, setYear] = useState(2026)
  const [versementLiberatoire, setVersementLiberatoire] = useState(false)
  const [acreActive, setAcreActive] = useState(false)
  const [autresRevenus, setAutresRevenus] = useState('')
  const [quotientFamilial, setQuotientFamilial] = useState(1)
  const [depensesTva, setDepensesTva] = useState([])

  const mainRef = useRef(null)

  const result = useTaxCalculator({
    ca,
    activityType,
    year,
    versementLiberatoire,
    acreActive,
    autresRevenus,
    quotientFamilial,
    depensesTva,
  })

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div>
            <h1 className="header-title">Simulateur Fiscal</h1>
            <p className="header-subtitle">Auto-Entrepreneur France — {year}</p>
          </div>
          <div className="header-actions">
            <DownloadPdfButton contentRef={mainRef} year={year} disabled={!result} />
            <div className="header-badge">
              <span>Données {year} — URSSAF</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main" ref={mainRef}>
        <div className="layout">
          <div className="col-left">
            <ActivitySelector value={activityType} onChange={setActivityType} />

            {activityType && (
              <RevenueInput
                ca={ca} onCaChange={setCa}
                year={year} onYearChange={setYear}
                activityType={activityType}
                versementLiberatoire={versementLiberatoire} onVersementChange={setVersementLiberatoire}
                acreActive={acreActive} onAcreChange={setAcreActive}
                autresRevenus={autresRevenus} onAutresRevenusChange={setAutresRevenus}
                quotientFamilial={quotientFamilial} onQuotientChange={setQuotientFamilial}
              />
            )}

            <TvaStatus result={result} />

            <ExpenseTracker
              depenses={depensesTva}
              onDepensesChange={setDepensesTva}
              tvaAssujetti={result?.tva?.assujetti ?? false}
            />
          </div>

          <div className="col-right">
            <TaxResults result={result} versementLiberatoire={versementLiberatoire} />
            <InfoPanel />
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>
          Simulation indicative — données URSSAF & Service-Public.fr ({year}).
          Non applicable aux régimes CIPAV, locations meublées ou activités mixtes complexes.
        </p>
      </footer>
    </div>
  )
}
