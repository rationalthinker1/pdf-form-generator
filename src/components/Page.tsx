import type { ReactNode } from 'react';
import { PAGE_SIZES } from '../types';
import type { PageSize } from '../types';

interface PageProps {
  size?: PageSize
  children?: ReactNode
  footer?: ReactNode
}

export function Page({ size = 'letter', children, footer }: PageProps) {
  const dims = PAGE_SIZES[size];

  return (
    <div
      data-pdf-page={size}
      className="page relative bg-white shadow-lg grid overflow-hidden print:shadow-none print:mx-0 print:my-0"
      style={{
        width: dims.widthPx,
        height: dims.heightPx,
        flexShrink: 0,
        gridTemplateRows: footer ? '1fr auto' : '1fr',
      }}
    >
      <div className="min-h-0 overflow-hidden px-10 pt-12">{children}</div>
      {footer}
    </div>
  );
}
