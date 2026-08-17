import {
  RTL_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  isRTL,
  getTextDirection,
} from '@/lib/i18n/rtl';

describe('frontend RTL locale configuration (lib/i18n/rtl)', () => {
  it('exposes the authoritative RTL_LOCALES constant including ar and he', () => {
    expect(RTL_LOCALES).toEqual(expect.arrayContaining(['ar', 'he']));
  });

  it('resolves Arabic to rtl', () => {
    expect(isRTL('ar')).toBe(true);
    expect(getTextDirection('ar')).toBe('rtl');
  });

  it('resolves Hebrew to rtl', () => {
    expect(isRTL('he')).toBe(true);
    expect(getTextDirection('he')).toBe('rtl');
  });

  it('resolves LTR locales to ltr', () => {
    expect(isRTL('en')).toBe(false);
    expect(getTextDirection('en')).toBe('ltr');
    expect(isRTL('es')).toBe(false);
    expect(getTextDirection('es')).toBe('ltr');
  });

  it('defaults to en with a stable cookie name', () => {
    expect(DEFAULT_LOCALE).toBe('en');
    expect(LOCALE_COOKIE_NAME).toBe('NEXT_LOCALE');
  });

  it('supports additional RTL locales via the single constant', () => {
    expect(getTextDirection('fa')).toBe('rtl');
    expect(getTextDirection('ur')).toBe('rtl');
  });
});
