import type { ReactNode } from 'react';
import { PAGE_SIZES } from '../types';
import type { PageSize } from '../types';

interface PageProps {
  size?: PageSize
  children?: ReactNode
}

export function Page({ size = 'letter', children }: PageProps) {
  const dims = PAGE_SIZES[size];

  return (
    <div
      data-pdf-page={size}
      className="page relative bg-white shadow-lg flex flex-col  px-10 pt-12"
      style={{
        width: dims.widthPx,
        height: dims.heightPx,
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}
