import type { ReactNode } from 'react';

interface BoxProps {
  className?: string
  style?: React.CSSProperties
  children?: ReactNode
}

export function Box({ className, style, children }: BoxProps) {
  return (
    <div
      data-pdf-box="true"
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}
