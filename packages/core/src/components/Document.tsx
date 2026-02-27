import { useEffect, useMemo, type ReactNode } from 'react'
import { DocumentContext, createFieldRegistry } from '../context/DocumentContext'
import type { ExtractedData } from '../types'
import { PAGE_SIZES } from '../types'

declare global {
  interface Window {
    __ready: boolean
    __extractFieldData: () => ExtractedData
    __formData: Record<string, string>
  }
}

interface DocumentProps {
  children?: ReactNode
}

export function Document({ children }: DocumentProps) {
  const registry = useMemo(() => createFieldRegistry(), [])

  useEffect(() => {
    window.__extractFieldData = (): ExtractedData => {
      const pages = registry.getPages()
      const fields = registry.getFields()

      return {
        pages: pages.map((page, pageIndex) => {
          const pageEl = page.ref.current
          if (!pageEl) throw new Error(`Page ${pageIndex} ref not attached`)
          const pageRect = pageEl.getBoundingClientRect()
          const dims = PAGE_SIZES[page.size]

          return {
            ...dims,
            fields: fields
              .filter(f => {
                const el = f.ref.current
                if (!el) return false
                const rect = el.getBoundingClientRect()
                return (
                  rect.top >= pageRect.top - 1 &&
                  rect.bottom <= pageRect.bottom + 1
                )
              })
              .map(f => {
                const el = f.ref.current!
                const rect = el.getBoundingClientRect()
                return {
                  name: f.name,
                  type: f.type,
                  pageIndex,
                  x: rect.left - pageRect.left,
                  y: rect.top - pageRect.top,
                  width: rect.width,
                  height: rect.height,
                  defaultValue: f.defaultValue ?? window.__formData?.[f.name],
                }
              }),
          }
        }),
      }
    }

    window.__ready = true
  }, [registry])

  return (
    <DocumentContext.Provider value={registry}>
      <div className="flex flex-col items-center gap-8 bg-gray-100 p-8">
        {children}
      </div>
    </DocumentContext.Provider>
  )
}
