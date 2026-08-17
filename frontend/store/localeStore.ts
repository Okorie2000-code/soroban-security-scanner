'use client';

// frontend/store/localeStore.ts
//
// Global locale state for the frontend.
//
// - The initial value is `DEFAULT_LOCALE` on BOTH server and client so the
//   first client render matches the server render (no hydration mismatch).
// - `setLocale()` persists the locale in a cookie (`NEXT_LOCALE`) so the
//   server-rendered `<html lang dir>` stays in sync on the next request,
//   and imperatively updates `document.documentElement.lang/dir` so the
//   currently rendered page flips direction immediately.
// - The LocaleProvider (see components/i18n/LocaleProvider) syncs the
//   cookie value into this store after hydration.

import { create } from 'zustand';
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, getTextDirection } from '@/lib/i18n/rtl';
import type { TextDirection } from '@/lib/i18n/rtl';

interface LocaleStore {
  /** Active locale, e.g. `en`, `es`, `ar`, `he`. */
  locale: string;
  /** Text direction derived from the active locale. */
  direction: TextDirection;
  /** Set the active locale, persist it and update the document direction. */
  setLocale: (locale: string) => void;
}

export const useLocaleStore = create<LocaleStore>()(set => ({
  locale: DEFAULT_LOCALE,
  direction: getTextDirection(DEFAULT_LOCALE),
  setLocale: locale => {
    const direction = getTextDirection(locale);

    if (typeof document !== 'undefined') {
      // Persist for server-rendered HTML on the next request.
      document.cookie = `${LOCALE_COOKIE_NAME}=${encodeURIComponent(locale)};path=/;max-age=31536000;samesite=lax`;
      // Flip the current page immediately.
      document.documentElement.lang = locale;
      document.documentElement.dir = direction;
    }

    set({ locale, direction });
  },
}));
