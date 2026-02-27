import { describe, it, expect } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { Text } from './Text'
import { DocumentContext } from '../context/DocumentContext'
import type { FieldRegistry } from '../context/DocumentContext'

function createMockRegistry(): FieldRegistry {
  return {
    registerField: () => {},
    unregisterField: () => {},
    getFields: () => [],
    registerPage: () => {},
    getPages: () => [],
    registerText: () => {},
    unregisterText: () => {},
    getTexts: () => [],
  }
}

function renderWithContext(element: React.ReactElement) {
  const registry = createMockRegistry()
  return renderToStaticMarkup(
    createElement(DocumentContext.Provider, { value: registry }, element)
  )
}

describe('Text', () => {
  it('renders children', () => {
    const html = renderWithContext(
      createElement(Text, { fontSize: 14 }, 'Hello World')
    )
    expect(html).toContain('Hello World')
  })

  it('renders with data-pdf-text attribute', () => {
    const html = renderWithContext(
      createElement(Text, { fontSize: 12 }, 'test')
    )
    expect(html).toContain('data-pdf-text')
  })

  it('applies font size as inline style', () => {
    const html = renderWithContext(
      createElement(Text, { fontSize: 20 }, 'big')
    )
    expect(html).toContain('font-size')
  })
})
