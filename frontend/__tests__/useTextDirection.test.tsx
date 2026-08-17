import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { useTextDirection } from '@/hooks/useTextDirection';
import { useLocaleStore } from '@/store/localeStore';

function Probe() {
  const direction = useTextDirection();
  return <div data-testid="direction">{direction}</div>;
}

describe('useTextDirection', () => {
  beforeEach(() => {
    // Reset the store to its default state between tests
    useLocaleStore.setState({ locale: 'en', direction: 'ltr' });
  });

  it('returns ltr by default', () => {
    render(<Probe />);
    expect(screen.getByTestId('direction')).toHaveTextContent('ltr');
  });

  it('returns rtl when the active locale is Arabic', () => {
    render(<Probe />);
    act(() => {
      useLocaleStore.getState().setLocale('ar');
    });
    expect(screen.getByTestId('direction')).toHaveTextContent('rtl');
  });

  it('returns rtl when the active locale is Hebrew', () => {
    render(<Probe />);
    act(() => {
      useLocaleStore.getState().setLocale('he');
    });
    expect(screen.getByTestId('direction')).toHaveTextContent('rtl');
  });

  it('returns ltr for an LTR locale (Spanish)', () => {
    render(<Probe />);
    act(() => {
      useLocaleStore.getState().setLocale('es');
    });
    expect(screen.getByTestId('direction')).toHaveTextContent('ltr');
  });

  it('reacts to locale changes back to ltr', () => {
    render(<Probe />);
    act(() => {
      useLocaleStore.getState().setLocale('ar');
    });
    expect(screen.getByTestId('direction')).toHaveTextContent('rtl');
    act(() => {
      useLocaleStore.getState().setLocale('en');
    });
    expect(screen.getByTestId('direction')).toHaveTextContent('ltr');
  });

  it('updates the document direction and lang when the locale changes', () => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
    act(() => {
      useLocaleStore.getState().setLocale('ar');
    });
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
  });
});
