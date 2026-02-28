import { describe, it, expect } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { TextField } from './TextField';

describe('TextField', () => {
  it('renders with data-field-name attribute', () => {
    const html = renderToStaticMarkup(
      createElement(TextField, { name: 'firstName', label: 'First Name' })
    );
    expect(html).toContain('data-field-name="firstName"');
  });

  it('renders default value when provided', () => {
    const html = renderToStaticMarkup(
      createElement(TextField, { name: 'city', defaultValue: 'Austin' })
    );
    expect(html).toContain('Austin');
  });

  it('renders label as placeholder when no default value', () => {
    const html = renderToStaticMarkup(
      createElement(TextField, { name: 'city', label: 'City' })
    );
    expect(html).toContain('City');
  });
});
