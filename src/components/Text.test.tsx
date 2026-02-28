import { describe, it, expect } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { Text } from './Text';

describe('Text', () => {
  it('renders children', () => {
    const html = renderToStaticMarkup(createElement(Text, {}, 'Hello World'));
    expect(html).toContain('Hello World');
  });

  it('renders with data-pdf-text attribute', () => {
    const html = renderToStaticMarkup(createElement(Text, {}, 'test'));
    expect(html).toContain('data-pdf-text');
  });

  it('passes className through', () => {
    const html = renderToStaticMarkup(createElement(Text, { className: 'text-red-500' }, 'styled'));
    expect(html).toContain('text-red-500');
  });
});
