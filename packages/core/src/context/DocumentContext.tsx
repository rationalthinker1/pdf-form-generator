import { createContext, useContext } from 'react'
import type { FieldRegistration, PageRegistration } from '../types'

// --- Registry factory (pure, testable) ---

export interface FieldRegistry {
  registerField: (field: FieldRegistration) => void
  unregisterField: (name: string) => void
  getFields: () => FieldRegistration[]
  registerPage: (page: PageRegistration) => void
  getPages: () => PageRegistration[]
}

export function createFieldRegistry(): FieldRegistry {
  const fields: FieldRegistration[] = []
  const pages: PageRegistration[] = []

  return {
    registerField(field) {
      const existing = fields.find(f => f.name === field.name)
      if (existing) throw new Error(`Duplicate field name "${field.name}"`)
      fields.push(field)
    },
    unregisterField(name) {
      const idx = fields.findIndex(f => f.name === name)
      if (idx !== -1) fields.splice(idx, 1)
    },
    getFields: () => fields,
    registerPage: (page) => pages.push(page),
    getPages: () => pages,
  }
}

// --- React context ---

const DocumentContext = createContext<FieldRegistry | null>(null)

export function useDocumentContext(): FieldRegistry {
  const ctx = useContext(DocumentContext)
  if (!ctx) throw new Error('useDocumentContext must be used inside <Pdf.Document>')
  return ctx
}

export { DocumentContext }
