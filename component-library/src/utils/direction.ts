// component-library/src/utils/direction.ts
//
// Shared text-direction helpers for RTL-aware components. These do NOT
// depend on the i18n config so they can be used by layout primitives
// without pulling i18next into the bundle.

export type TextDirection = 'ltr' | 'rtl';

/**
 * Resolve the current document text direction from the `dir` attribute on
 * `<html>` (set by the app for the active locale). Falls back to `'ltr'`
 * when no document is available (SSR, tests) or no direction is set.
 */
export function getDocumentDirection(): TextDirection {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
  }
  return 'ltr';
}
