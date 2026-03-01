import type { ReactNode } from 'react';

interface FooterProps {
  children?: ReactNode
}

export function Footer({ children }: FooterProps) {
  return (
    <div className="mt-auto px-3 pb-2 flex flex-row justify-between border-t border-gray-300 pt-1">
      {children}
    </div>
  );
}
