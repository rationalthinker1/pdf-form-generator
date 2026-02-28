import { useRef, useEffect, type ReactNode } from 'react';

interface TextProps {
  className?: string
  style?: React.CSSProperties
  children?: ReactNode
}

export function Text({ className, style, children }: TextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    const fontSizePx = parseFloat(cs.fontSize);
  el.dataset.pdfFontSize = String(Math.round(fontSizePx * 72 / 96));
    el.dataset.pdfBold = cs.fontWeight >= '600' ? 'true' : 'false';
    el.dataset.pdfColor = cs.color;
  });

  return (
    <div
      ref={ref}
      className={className}
      data-pdf-text="true"
      style={style}
    >
      {children}
    </div>
  );
}
