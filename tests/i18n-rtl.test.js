// tests/i18n-rtl.test.js
//
// Tests for the authoritative RTL locale configuration in src/i18n/config.js.

const { RTL_LOCALES, isRTL, getTextDirection } = require('../src/i18n/config');

describe('RTL locale configuration (src/i18n/config.js)', () => {
  it('exposes the authoritative RTL_LOCALES constant including ar and he', () => {
    expect(Array.isArray(RTL_LOCALES)).toBe(true);
    expect(RTL_LOCALES).toEqual(expect.arrayContaining(['ar', 'he']));
  });

  it('resolves Arabic to RTL', () => {
    expect(isRTL('ar')).toBe(true);
    expect(getTextDirection('ar')).toBe('rtl');
  });

  it('resolves Hebrew to RTL', () => {
    expect(isRTL('he')).toBe(true);
    expect(getTextDirection('he')).toBe('rtl');
  });

  it('resolves LTR locales to ltr', () => {
    expect(isRTL('en')).toBe(false);
    expect(getTextDirection('en')).toBe('ltr');
    expect(isRTL('es')).toBe(false);
    expect(getTextDirection('es')).toBe('ltr');
  });

  it('supports additional RTL locales via the single constant', () => {
    // Adding a locale to RTL_LOCALES is sufficient — no other logic to update
    expect(isRTL('fa')).toBe(true);
    expect(isRTL('ur')).toBe(true);
    expect(getTextDirection('fa')).toBe('rtl');
  });

  it('treats unknown locales as LTR', () => {
    expect(isRTL('xx')).toBe(false);
    expect(getTextDirection('xx')).toBe('ltr');
  });
});
