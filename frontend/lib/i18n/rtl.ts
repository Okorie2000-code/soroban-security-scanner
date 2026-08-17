// frontend/lib/i18n/rtl.ts
//
// Single authoritative RTL locale definition for the frontend.
// The <html> element direction, useTextDirection() and the locale store
// all derive from these constants — no other module should hard-code
// `ar`/`he` checks.

/** Right-to-left (RTL) locales. Arabic and Hebrew are RTL; add new RTL
 *  locales here and every consumer picks them up automatically. */
export const RTL_LOCALES = ['ar', 'he', 'fa', 'ur'] as const;

export type RtlLocale = (typeof RTL_LOCALES)[number];

export type TextDirection = 'ltr' | 'rtl';

/** Default locale used when no locale is stored/selected. */
export const DEFAULT_LOCALE = 'en';

/** Cookie used to persist the active locale for server-rendered HTML. */
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

/** Returns `true` when `locale` is a right-to-left locale. */
export function isRTL(locale: string): boolean {
  return RTL_LOCALES.includes(locale as RtlLocale);
}

/** Resolves the text direction for the given locale (not browser heuristics). */
export function getTextDirection(locale: string): TextDirection {
  return isRTL(locale) ? 'rtl' : 'ltr';
}
