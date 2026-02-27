import { useRef, useEffect } from 'react'
import { useDocumentContext } from '../context/DocumentContext'

interface TextFieldProps {
  name: string
  label?: string
  defaultValue?: string
}

export function TextField({ name, label, defaultValue }: TextFieldProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { registerField, unregisterField } = useDocumentContext()

  useEffect(() => {
    registerField({ name, type: 'text', ref, defaultValue })
    return () => unregisterField(name)
  }, [name, defaultValue]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={ref}
      data-field-name={name}
      data-field-type="text"
      className="min-h-[24px] border border-gray-400 bg-white px-2 py-1 text-sm text-gray-800"
    >
      {defaultValue ?? (
        <span className="text-gray-400 italic">{label ?? name}</span>
      )}
    </div>
  )
}
