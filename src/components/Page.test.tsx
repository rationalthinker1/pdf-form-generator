import { describe, it, expect } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { Page } from './Page';

describe('Page', () => {
  it('renders with data-pdf-page="letter" by default', () => {
    const html = renderToStaticMarkup(createElement(Page, {}));
    expect(html).toContain('data-pdf-page="letter"');
  });

  it('renders with data-pdf-page="a4" when specified', () => {
    const html = renderToStaticMarkup(createElement(Page, { size: 'a4' }));
    expect(html).toContain('data-pdf-page="a4"');
  });

  it('renders children', () => {
    const html = renderToStaticMarkup(
      createElement(Page, {}, createElement('span', { id: 'child' }))
    );
    expect(html).toContain('id="child"');
  });
});
