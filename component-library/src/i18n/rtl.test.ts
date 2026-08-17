import { RTL_LOCALES, isRTL, getTextDirection, supportedLanguages } from './config';

describe('RTL locale configuration (component-library)', () => {
  it('exposes the authoritative RTL_LOCALES constant including ar and he', () => {
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

  it('allows additional RTL locales without duplicating locale logic', () => {
    // fa/ur are already listed; adding a new entry to RTL_LOCALES is enough
    expect(isRTL('fa')).toBe(true);
    expect(isRTL('ur')).toBe(true);
  });

  it('derives supportedLanguages direction from RTL_LOCALES', () => {
    const ar = supportedLanguages.find(l => l.code === 'ar');
    const en = supportedLanguages.find(l => l.code === 'en');
    expect(ar?.dir).toBe('rtl');
    expect(en?.dir).toBe('ltr');
  });
});
