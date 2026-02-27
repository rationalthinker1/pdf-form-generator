import { useRef, useEffect, type ReactNode } from 'react'
import { useDocumentContext } from '../context/DocumentContext'

interface TextProps {
  fontSize?: number
  bold?: boolean
  color?: string
  children: ReactNode
}

export function Text({ fontSize = 12, bold = false, color = '#000000', children }: TextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { registerText, unregisterText } = useDocumentContext()

  const text = typeof children === 'string' ? children : String(children ?? '')

  useEffect(() => {
    registerText({ ref, text, fontSize, bold, color })
    return () => unregisterText(ref)
  }, [text, fontSize, bold, color]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={ref}
      data-pdf-text="true"
      style={{
        fontSize,
        fontWeight: bold ? 'bold' : 'normal',
        color,
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {children}
    </div>
  )
}
