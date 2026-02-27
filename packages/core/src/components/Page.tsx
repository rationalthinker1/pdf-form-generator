import { useRef, useEffect, type ReactNode } from 'react'
import { useDocumentContext } from '../context/DocumentContext'
import { PAGE_SIZES } from '../types'
import type { PageSize } from '../types'

interface PageProps {
  size?: PageSize
  children?: ReactNode
}

export function Page({ size = 'letter', children }: PageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { registerPage, getPages } = useDocumentContext()
  const dims = PAGE_SIZES[size]

  useEffect(() => {
    const pageIndex = getPages().length
    registerPage({ pageIndex, size, ref })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={ref}
      data-size={size}
      className="relative bg-white shadow-lg"
      style={{
        width: dims.widthPx,
        height: dims.heightPx,
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  )
}
