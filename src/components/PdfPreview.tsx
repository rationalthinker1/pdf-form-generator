import { useCallback, useRef, useState } from 'react'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import type { RenderParameters } from 'pdfjs-dist/types/src/display/api'

// Point PDF.js worker at the bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString()

const SCALE = 72 / 96 // px → pt

export function PdfPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const generate = useCallback(async () => {
    setError(null)
    setGenerating(true)
    try {
      const extracted = window.__extractFieldData()
      const pdfDoc = await PDFDocument.create()
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const FONT_SIZE = 7
      const LABEL_SIZE = 6

      for (const pageData of extracted.pages) {
        const page = pdfDoc.addPage([pageData.widthPt, pageData.heightPt])

        // Draw text labels
        for (const text of pageData.texts) {
          const xPt = text.x * SCALE
          const yPt = pageData.heightPt - (text.y + text.height) * SCALE
          const hex = text.color.replace('#', '')
          const r = parseInt(hex.slice(0, 2), 16) / 255
          const g = parseInt(hex.slice(2, 4), 16) / 255
          const b = parseInt(hex.slice(4, 6), 16) / 255
          page.drawText(text.text, {
            x: xPt,
            y: yPt,
            size: text.bold ? LABEL_SIZE + 1 : LABEL_SIZE,
            font: text.bold ? helveticaBold : helvetica,
            color: rgb(r, g, b),
          })
        }

        // Draw boxes
        for (const box of pageData.boxes) {
          const xPt = box.x * SCALE
          const wPt = box.width * SCALE
          const hPt = box.height * SCALE
          const yPt = pageData.heightPt - (box.y + box.height) * SCALE
          page.drawRectangle({
            x: xPt, y: yPt, width: wPt, height: hPt,
            borderColor: rgb(0.2, 0.2, 0.2),
            borderWidth: box.borderWidth ?? 1,
          })
        }

        // Draw AcroForm text fields
        const form = pdfDoc.getForm()
        for (const field of pageData.fields) {
          // Use PDF-space coords if available (Playwright path), otherwise convert from px
          const xPt = field.xPt ?? field.x * SCALE
          const wPt = field.widthPt ?? field.width * SCALE
          const hPt = field.heightPt ?? field.height * SCALE
          const yPt = pageData.heightPt - (field.y + field.height) * SCALE

          const tf = form.createTextField(field.name)
          tf.addToPage(page, {
            x: xPt + 2,
            y: yPt,
            width: wPt - 2,
            height: hPt,
            font: helvetica,
            backgroundColor: rgb(0.93, 0.96, 1),
            borderColor: rgb(0.6, 0.6, 0.6),
            borderWidth: 0.5,
          })
          tf.setFontSize(FONT_SIZE)
          if (field.defaultValue) tf.setText(field.defaultValue)
        }
      }

      const pdfBytes = await pdfDoc.save()

      // Render first page with PDF.js
      const loadingTask = pdfjsLib.getDocument({ data: pdfBytes })
      const pdf = await loadingTask.promise
      const pdfPage = await pdf.getPage(1)
      const viewport = pdfPage.getViewport({ scale: 1.5 })
      const canvas = canvasRef.current!
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')!
      await pdfPage.render({ canvasContext: ctx, viewport } as RenderParameters).promise
    } catch (e) {
      setError(String(e))
    } finally {
      setGenerating(false)
    }
  }, [])

  return (
    <div className="mt-4 flex flex-col gap-2">
      <button
        type="button"
        onClick={generate}
        disabled={generating}
        className="self-start rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {generating ? 'Generating…' : 'Preview PDF'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <canvas ref={canvasRef} className="border border-gray-300 shadow" />
    </div>
  )
}
