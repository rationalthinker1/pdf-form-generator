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
