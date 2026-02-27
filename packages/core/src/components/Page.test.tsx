import { describe, it, expect } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { Page } from './Page'
import { DocumentContext } from '../context/DocumentContext'
import type { FieldRegistry } from '../context/DocumentContext'

// Minimal mock registry that satisfies the FieldRegistry interface
function createMockRegistry(): FieldRegistry {
  return {
    registerField: () => {},
    unregisterField: () => {},
    getFields: () => [],
    registerPage: () => {},
    getPages: () => [],
  }
}

function renderWithContext(element: React.ReactElement) {
  const registry = createMockRegistry()
  return renderToStaticMarkup(
    createElement(DocumentContext.Provider, { value: registry }, element)
  )
}

describe('Page', () => {
  it('renders with data-size="letter" by default', () => {
    const html = renderWithContext(createElement(Page, {}))
    expect(html).toContain('data-size="letter"')
  })

  it('renders with data-size="a4" when specified', () => {
    const html = renderWithContext(createElement(Page, { size: 'a4' }))
    expect(html).toContain('data-size="a4"')
  })

  it('renders children', () => {
    const html = renderWithContext(
      createElement(Page, {}, createElement('span', { id: 'child' }))
    )
    expect(html).toContain('id="child"')
  })
})
