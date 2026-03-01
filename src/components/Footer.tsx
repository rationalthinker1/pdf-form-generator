import type { ReactNode } from 'react';

interface FooterProps {
  children?: ReactNode
}

export function Footer({ children }: FooterProps) {
  return (
    <div className="px-3 py-2 flex flex-row justify-between border-t border-gray-300">
      {children}
    </div>
  );
}
