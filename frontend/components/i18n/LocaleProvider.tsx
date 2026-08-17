'use client';

// frontend/components/i18n/LocaleProvider.tsx
//
// Bridges the server-rendered locale (read from the NEXT_LOCALE cookie by
// the root layout) into the client locale store.
//
// The store starts at DEFAULT_LOCALE on both server and client so the first
// client render matches the server render — this effect runs only after
// hydration, then flips the store to the persisted locale. That keeps the
// client components that consume useTextDirection() in sync with the
// `<html dir>` attribute set by the layout without hydration mismatches.

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocaleStore } from '@/store/localeStore';

interface LocaleProviderProps {
  /** Locale the server rendered with (from the NEXT_LOCALE cookie). */
  locale: string;
  children: ReactNode;
}

export function LocaleProvider({ locale, children }: LocaleProviderProps) {
  useEffect(() => {
    const { locale: current, setLocale } = useLocaleStore.getState();
    if (current !== locale) {
      setLocale(locale);
    }
  }, [locale]);

  return <>{children}</>;
}

export default LocaleProvider;
