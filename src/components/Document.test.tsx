import { describe, it, expect } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { Document } from './Document';

describe('Document', () => {
  it('renders children', () => {
    const html = renderToStaticMarkup(
      createElement(Document, null, createElement('div', { id: 'child' }))
    );
    expect(html).toContain('id="child"');
  });

  it('renders a wrapper element', () => {
    const html = renderToStaticMarkup(
      createElement(Document, null, null)
    );
    expect(html.length).toBeGreaterThan(0);
  });
});
