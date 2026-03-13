const fmt = (n) =>
  n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

export default function TvaStatus({ result }) {
  if (!result) return null

  const { tva, ca } = result

  return (
    <div className="card">
      <h2 className="card-title">Statut TVA</h2>

      {tva.franchise && (
        <div className="tva-status tva-franchise">
          <div className="tva-badge badge-green">✓ Franchise en base de TVA</div>
          <p>
            Vous êtes exonéré de TVA. Vous ne la facturez pas à vos clients
            et ne la récupérez pas sur vos achats.
          </p>
          <p className="tva-mention">
            Mention obligatoire sur vos factures :<br />
            <code>« TVA non applicable, article 293 B du CGI »</code>
          </p>
          <div className="tva-seuils">
            <div className="seuil-item">
              <span>Seuil de franchise</span>
              <strong>{fmt(tva.seuilFranchise)}</strong>
            </div>
            <div className="seuil-item">
              <span>Seuil majoré (tolérance)</span>
              <strong>{fmt(tva.seuilMajore)}</strong>
            </div>
            <div className="seuil-item">
              <span>Marge avant seuil</span>
              <strong className="margin-ok">{fmt(tva.seuilFranchise - ca)}</strong>
            </div>
          </div>
        </div>
      )}

      {tva.tolerance && (
        <div className="tva-status tva-tolerance">
          <div className="tva-badge badge-orange">⚠ Zone de tolérance</div>
          <p>
            Votre CA dépasse le seuil de franchise ({fmt(tva.seuilFranchise)}) mais reste
            sous le seuil majoré ({fmt(tva.seuilMajore)}).
          </p>
          <p>
            <strong>La franchise s'applique encore cette année</strong>, mais vous perdrez
            l'exonération TVA au 1er janvier de l'année suivante si vous restez au-dessus.
          </p>
        </div>
      )}

      {tva.assujetti && (
        <div className="tva-status tva-assujetti">
          <div className="tva-badge badge-red">✗ Assujetti à la TVA</div>
          <p>
            Votre CA dépasse le seuil majoré ({fmt(tva.seuilMajore)}).
            Vous devez facturer la TVA à vos clients et la reverser à l'État.
          </p>
          <ul className="tva-obligations">
            <li>Facturer la TVA sur vos ventes / prestations</li>
            <li>Déduire la TVA sur vos achats professionnels</li>
            <li>Déposer des déclarations de TVA périodiques</li>
            <li>Obtenir un numéro de TVA intracommunautaire</li>
          </ul>
          <p className="tva-note">
            En contrepartie, vous récupérez la TVA sur vos achats — utilisez
            le <em>Suivi des achats</em> ci-dessous pour calculer votre TVA déductible.
          </p>
        </div>
      )}
    </div>
  )
}
