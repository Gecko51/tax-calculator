import { useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

/**
 * Capture le contenu de `contentRef` et le télécharge en PDF A4 paysage.
 * @param {{ contentRef: React.RefObject<HTMLElement>, year: number, disabled: boolean }} props
 */
export default function DownloadPdfButton({ contentRef, year, disabled }) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    if (!contentRef.current || loading) return
    setLoading(true)

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        // Correspond à --gray-100 (background body)
        backgroundColor: '#f3f4f6',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

      // A4 paysage : 297 × 210 mm
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = pdf.internal.pageSize.getHeight()
      const margin = 8
      const usableW = pdfW - margin * 2  // 281 mm
      const usableH = pdfH - margin * 2  // 194 mm

      // Calcul des dimensions en mm en préservant le ratio
      let imgW = usableW
      let imgH = (canvas.height / canvas.width) * imgW
      if (imgH > usableH) {
        imgH = usableH
        imgW = (canvas.width / canvas.height) * imgH
      }

      const x = margin + (usableW - imgW) / 2
      const y = margin + (usableH - imgH) / 2

      pdf.addImage(imgData, 'PNG', x, y, imgW, imgH)
      pdf.save(`simulation-fiscale-${year}.pdf`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className="btn-pdf"
      onClick={handleDownload}
      disabled={disabled || loading}
      title={disabled ? 'Remplissez la simulation pour télécharger' : 'Télécharger la simulation en PDF'}
    >
      {loading ? 'Génération…' : '↓ PDF'}
    </button>
  )
}
