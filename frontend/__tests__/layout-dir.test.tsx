import React from 'react';
import { render } from '@testing-library/react';
import RootLayout from '@/app/layout';

// The locale cookie is the single input that drives <html lang dir>.
// jest.setup.js already mocks next/headers for `headers()`; here we override
// the module with a controllable `cookies()` for the layout tests.
let mockLocale: string | undefined;

jest.mock('next/headers', () => ({
  headers: () => ({ get: jest.fn(() => 'test-nonce-123456') }),
  cookies: () => ({
    get: jest.fn((name: string) => (mockLocale ? { name, value: mockLocale } : undefined)),
  }),
}));

describe('RootLayout document direction', () => {
  afterEach(() => {
    mockLocale = undefined;
  });

  const renderLayout = () =>
    render(
      <RootLayout>
        <div>page content</div>
      </RootLayout>
    );

  it('renders <html dir="rtl" lang="ar"> for Arabic', () => {
    mockLocale = 'ar';
    const { container } = renderLayout();
    const html = container.querySelector('html');
    expect(html?.getAttribute('dir')).toBe('rtl');
    expect(html?.getAttribute('lang')).toBe('ar');
  });

  it('renders <html dir="rtl" lang="he"> for Hebrew', () => {
    mockLocale = 'he';
    const { container } = renderLayout();
    const html = container.querySelector('html');
    expect(html?.getAttribute('dir')).toBe('rtl');
    expect(html?.getAttribute('lang')).toBe('he');
  });

  it('renders <html dir="ltr" lang="es"> for an LTR locale', () => {
    mockLocale = 'es';
    const { container } = renderLayout();
    const html = container.querySelector('html');
    expect(html?.getAttribute('dir')).toBe('ltr');
    expect(html?.getAttribute('lang')).toBe('es');
  });

  it('renders <html dir="ltr" lang="en"> when no locale cookie is set', () => {
    mockLocale = undefined;
    const { container } = renderLayout();
    const html = container.querySelector('html');
    expect(html?.getAttribute('dir')).toBe('ltr');
    expect(html?.getAttribute('lang')).toBe('en');
  });
});
