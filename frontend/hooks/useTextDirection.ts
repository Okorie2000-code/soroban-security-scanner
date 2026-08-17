'use client';

// frontend/hooks/useTextDirection.ts
//
// Returns the text direction (`'ltr'` | `'rtl'`) of the active locale.
// The direction is derived from the authoritative `RTL_LOCALES` definition
// (lib/i18n/rtl.ts) via the locale store — never from browser heuristics.
//
// SSR note: the store initialises to `DEFAULT_LOCALE` on both server and
// client, so the first client render matches the server render. The
// LocaleProvider syncs the persisted locale after hydration, which flips
// the direction without a hydration mismatch.

import { useLocaleStore } from '@/store/localeStore';
import type { TextDirection } from '@/lib/i18n/rtl';

export function useTextDirection(): TextDirection {
  return useLocaleStore(state => state.direction);
}

export default useTextDirection;
