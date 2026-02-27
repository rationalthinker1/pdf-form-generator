import { describe, it, expect } from 'bun:test'
import { createRef } from 'react'
import { createFieldRegistry } from './DocumentContext'

describe('createFieldRegistry', () => {
  it('registers a field', () => {
    const registry = createFieldRegistry()
    const ref = createRef<HTMLDivElement>()
    registry.registerField({ name: 'firstName', type: 'text', ref })
    expect(registry.getFields()).toHaveLength(1)
    expect(registry.getFields()[0].name).toBe('firstName')
  })

  it('throws on duplicate field name', () => {
    const registry = createFieldRegistry()
    const ref = createRef<HTMLDivElement>()
    registry.registerField({ name: 'firstName', type: 'text', ref })
    expect(() =>
      registry.registerField({ name: 'firstName', type: 'text', ref })
    ).toThrow('Duplicate field name "firstName"')
  })

  it('unregisters a field', () => {
    const registry = createFieldRegistry()
    const ref = createRef<HTMLDivElement>()
    registry.registerField({ name: 'firstName', type: 'text', ref })
    registry.unregisterField('firstName')
    expect(registry.getFields()).toHaveLength(0)
  })
})

describe('createFieldRegistry - text registry', () => {
  it('registers a text', () => {
    const registry = createFieldRegistry()
    const ref = createRef<HTMLDivElement>()
    registry.registerText({ ref, text: 'Hello', fontSize: 12, bold: false, color: '#000000' })
    expect(registry.getTexts()).toHaveLength(1)
    expect(registry.getTexts()[0].text).toBe('Hello')
  })

  it('unregisters a text by ref', () => {
    const registry = createFieldRegistry()
    const ref = createRef<HTMLDivElement>()
    registry.registerText({ ref, text: 'Hello', fontSize: 12, bold: false, color: '#000000' })
    registry.unregisterText(ref)
    expect(registry.getTexts()).toHaveLength(0)
  })
})
