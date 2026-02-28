import type { ReactNode } from 'react';

interface BoxProps {
  className?: string
  style?: React.CSSProperties
  children?: ReactNode
  borderWidth?: number
}

export function Box({ className, style, children, borderWidth }: BoxProps) {
  return (
    <div
      data-pdf-box="true"
      data-pdf-box-border={borderWidth}
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}
