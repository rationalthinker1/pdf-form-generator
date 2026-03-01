import { describe, it, expect } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { CheckboxField } from './CheckboxField';

describe('CheckboxField', () => {
  it('renders with data-field-name attribute', () => {
    const html = renderToStaticMarkup(
      createElement(CheckboxField, { name: 'agree' })
    );
    expect(html).toContain('data-field-name="agree"');
  });

  it('renders with data-field-type="checkbox"', () => {
    const html = renderToStaticMarkup(
      createElement(CheckboxField, { name: 'agree' })
    );
    expect(html).toContain('data-field-type="checkbox"');
  });

  it('renders as checked when defaultValue is true', () => {
    const html = renderToStaticMarkup(
      createElement(CheckboxField, { name: 'agree', defaultChecked: true })
    );
    expect(html).toContain('data-field-default-value="true"');
  });

  it('renders as unchecked by default', () => {
    const html = renderToStaticMarkup(
      createElement(CheckboxField, { name: 'agree' })
    );
    expect(html).toContain('data-field-default-value="false"');
  });
});
