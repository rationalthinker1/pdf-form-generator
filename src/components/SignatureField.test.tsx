import { describe, it, expect } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { SignatureField } from './SignatureField';

describe('SignatureField', () => {
  it('renders with data-field-name attribute', () => {
    const html = renderToStaticMarkup(
      createElement(SignatureField, { name: 'p0.signature' })
    );
    expect(html).toContain('data-field-name="p0.signature"');
  });

  it('renders with data-field-type="signature"', () => {
    const html = renderToStaticMarkup(
      createElement(SignatureField, { name: 'p0.signature' })
    );
    expect(html).toContain('data-field-type="signature"');
  });

  it('renders label text when provided', () => {
    const html = renderToStaticMarkup(
      createElement(SignatureField, { name: 'p0.signature', label: 'Customer Signature' })
    );
    expect(html).toContain('Customer Signature');
  });

  it('renders default label when no label provided', () => {
    const html = renderToStaticMarkup(
      createElement(SignatureField, { name: 'p0.signature' })
    );
    expect(html).toContain('Signature');
  });
});
