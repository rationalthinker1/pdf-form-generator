import { describe, it, expect } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders children', () => {
    const html = renderToStaticMarkup(
      createElement(Footer, null, 'Canada Home Protect')
    );
    expect(html).toContain('Canada Home Protect');
  });

  it('renders a bordered row', () => {
    const html = renderToStaticMarkup(
      createElement(Footer, null, '2/5')
    );
    expect(html).toContain('border-t');
  });

  it('renders multiple children in a row', () => {
    const html = renderToStaticMarkup(
      createElement(
        Footer,
        null,
        createElement('span', null, 'Canada Home Protect'),
        createElement('span', null, '2/5'),
        createElement('span', null, 'PG2/5'),
      )
    );
    expect(html).toContain('Canada Home Protect');
    expect(html).toContain('2/5');
    expect(html).toContain('PG2/5');
  });
});
