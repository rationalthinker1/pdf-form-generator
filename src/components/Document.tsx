import { useEffect, useRef, type ReactNode } from 'react';
import type { ExtractedData, ExtractedPage, FieldType, PageSize } from '../types';
import { PAGE_SIZES } from '../types';

function rgbToHex(rgb: string): string {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return '#000000';
  return '#' + [m[1], m[2], m[3]]
    .map(n => parseInt(n).toString(16).padStart(2, '0'))
    .join('');
}

declare global {
  interface Window {
    __ready: boolean
    __extractFieldData: () => ExtractedData
    __formData: Record<string, string>
  }
}

interface DocumentProps {
  children?: ReactNode
}

export function Document({ children }: DocumentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.__extractFieldData = (): ExtractedData => {
      const rootEl = ref.current;
      if (!rootEl) throw new Error('Document ref not attached');

      const pageEls = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-pdf-page]'));

      const pages: ExtractedPage[] = pageEls.map((pageEl, pageIndex) => {
        const size = (pageEl.dataset.pdfPage ?? 'letter') as PageSize;
        const dims = PAGE_SIZES[size];
        const pageRect = pageEl.getBoundingClientRect();

        const fields = Array.from(pageEl.querySelectorAll<HTMLElement>('[data-field-name]'))
          .map(el => {
            const rect = el.getBoundingClientRect();
            const name = el.dataset.fieldName!;
            const storedDefault = el.dataset.fieldDefaultValue;
            return {
              name,
              type: (el.dataset.fieldType ?? 'text') as FieldType,
              pageIndex,
              x: rect.left - pageRect.left,
              y: rect.top - pageRect.top,
              width: rect.width,
              height: rect.height,
              defaultValue: window.__formData?.[name] ?? storedDefault,
            };
          });

        const texts = Array.from(pageEl.querySelectorAll<HTMLElement>('[data-pdf-text]'))
          .map(el => {
            const rect = el.getBoundingClientRect();
            const fs = el.dataset.pdfFontSize;
            // Use getComputedStyle so we always get rgb() regardless of CSS color format
            const computedColor = getComputedStyle(el).color;
            const cs = getComputedStyle(el);
            const transform = cs.textTransform;
            let text = el.textContent ?? '';
            if (transform === 'uppercase') text = text.toUpperCase();
            else if (transform === 'lowercase') text = text.toLowerCase();
            return {
              text,
              pageIndex,
              x: rect.left - pageRect.left,
              y: rect.top - pageRect.top,
              width: rect.width,
              height: rect.height,
              fontSize: fs !== undefined ? Number(fs) : 12,
              bold: el.dataset.pdfBold === 'true',
              color: rgbToHex(computedColor),
            };
          });

        const boxes = Array.from(pageEl.querySelectorAll<HTMLElement>('[data-pdf-box]'))
          .map(el => {
            const rect = el.getBoundingClientRect();
            const bw = el.dataset.pdfBoxBorder;
            return {
              pageIndex,
              x: rect.left - pageRect.left,
              y: rect.top - pageRect.top,
              width: rect.width,
              height: rect.height,
              borderWidth: bw !== undefined ? Number(bw) : undefined,
            };
          });

        return { ...dims, fields, texts, boxes };
      });

      const scripts = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-pdf-script]'))
        .map(el => el.textContent ?? '');

      return { pages, scripts };
    };

    window.__ready = true;
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-8 bg-gray-100 p-8 print:gap-0 print:p-0 print:bg-transparent">
      {children}
    </div>
  );
}
