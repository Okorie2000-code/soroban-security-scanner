# Internationalization (i18n) Support

This document describes the internationalization features added to the Soroban Security Scanner.

## Overview

The Soroban Security Scanner now supports full internationalization with:
- **Multiple Languages**: English (en), Spanish (es), and Arabic (ar)
- **RTL Support**: Right-to-Left language support for Arabic
- **Currency & Date Formatting**: Localized formatting for different regions
- **CLI & UI**: Both command-line and React components are internationalized
- **Dynamic Language Switching**: Runtime language switching for web interface

## Supported Languages

| Language | Code | Direction | Status |
|----------|------|-----------|---------|
| English | `en` | LTR | ✅ Complete |
| Spanish | `es` | LTR | ✅ Complete |
| Arabic | `ar` | RTL | ✅ Complete |

## Features

### 1. Command Line Interface (CLI)

The CLI tool now supports multiple languages through environment variables:

```bash
# Set language for CLI
export LANG=es  # Spanish
export LANG=ar  # Arabic
export LANG=en  # English (default)

# Run scanner with localized output
soroban-scanner scan contract.rs
```

### 2. React Components

#### Language Selector Component
```tsx
import { LanguageSelector } from '@soroban-scanner/ui-components';

function App() {
  return <LanguageSelector showFlags={true} />;
}
```

#### RTL Support Hook
```tsx
import { useRTL, useRTLStyles } from '@soroban-scanner/ui-components';

function MyComponent() {
  const { direction, isRTL } = useRTL();
  const { getMarginStyle, getTextAlign } = useRTLStyles();
  
  return (
    <div dir={direction} style={{ textAlign: getTextAlign() }}>
      Content
    </div>
  );
}
```

#### Language Management Hook
```tsx
import { useLanguage } from '@soroban-scanner/ui-components';

function LanguageManager() {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  
  const handleLanguageChange = (lang) => {
    await changeLanguage(lang);
  };
  
  return (
    <select value={currentLanguage} onChange={handleLanguageChange}>
      {supportedLanguages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
```

### 3. Currency & Date Formatting

```tsx
import { formatCurrency, formatDate } from '@soroban-scanner/ui-components';

// Format currency for different locales
const price = formatCurrency(1234.56, 'ar', 'USD'); // $1,234.56 (Arabic formatting)
const priceES = formatCurrency(1234.56, 'es', 'EUR'); // €1.234,56 (Spanish formatting)

// Format dates for different locales
const date = formatDate(new Date(), 'ar'); // Arabic date format
const dateES = formatDate(new Date(), 'es'); // Spanish date format
```

### 4. Notification Service

Email and in-app notifications are now localized:

```javascript
// Templates automatically use the current language
const notification = await service.sendTemplatedNotification(
  'vulnerability_alert',
  recipient,
  context,
  channels,
  priority
);
```

### 5. Security Reports

Security scan reports are generated in the appropriate language:

```javascript
// Reports use localized text and formatting
const reporter = new SecurityReporter();
const report = reporter.generate(vulnerabilities, 'text');
```

## File Structure

```
soroban-security-scanner/
├── locales/
│   ├── en/
│   │   └── common.json
│   ├── es/
│   │   └── common.json
│   └── ar/
│       └── common.json
├── src/
│   └── i18n/
│       └── config.js
├── component-library/
│   ├── src/
│   │   ├── i18n/
│   │   │   └── config.ts
│   │   ├── components/
│   │   │   ├── LanguageSelector.tsx
│   │   │   └── I18nDemo.tsx
│   │   ├── hooks/
│   │   │   └── useRTL.ts
│   │   └── styles/
│   │       └── rtl.css
```

## Translation Keys

Translation keys are organized in a hierarchical structure:

```json
{
  "scanner": {
    "name": "Soroban Security Scanner",
    "description": "Security scanner for Soroban smart contracts"
  },
  "commands": {
    "scan": {
      "description": "Scan for security vulnerabilities",
      "starting": "🔍 Starting Soroban Security Scanner..."
    }
  },
  "reporter": {
    "recommendations": "📋 RECOMMENDATIONS:",
    "high_priority": "HIGH PRIORITY:"
  }
}
```

## RTL Support

### CSS Classes
The RTL CSS provides utility classes for right-to-left layouts:

```css
[dir="rtl"] .text-start { text-align: right; }
[dir="rtl"] .ms-1 { margin-left: 0; margin-right: 0.25rem; }
[dir="rtl"] .border-start { border-left: none; border-right: 1px solid #dee2e6; }
```

### Automatic Direction Detection
The system automatically detects RTL languages and applies appropriate styling:

```tsx
// Document direction is automatically set
document.documentElement.dir = direction; // 'rtl' or 'ltr'
document.body.classList.add('rtl'); // or 'ltr'
```

## RTL Language Support (Layout & Direction)

Right-to-left support is implemented end-to-end: the `<html>` element gets the
correct `dir` attribute, Tailwind `rtl:` variants are enabled, and layout
primitives (`RtlContainer`, `RtlAwareIcon`) mirror direction-sensitive UI.

### Supported RTL locales

| Language | Code | Direction |
|----------|------|-----------|
| Arabic | `ar` | RTL ✅ |
| Hebrew | `he` | RTL ✅ |
| Persian | `fa` | RTL ✅ |
| Urdu | `ur` | RTL ✅ |
| English | `en` | LTR |
| Spanish | `es` | LTR |

### How `RTL_LOCALES` works

Each package keeps a **single authoritative `RTL_LOCALES` constant** — no other
code hard-codes `ar`/`he` checks:

- `src/i18n/config.js` → `RTL_LOCALES` (CLI / Node)
- `component-library/src/i18n/config.ts` → `RTL_LOCALES` (UI components)
- `frontend/lib/i18n/rtl.ts` → `RTL_LOCALES` (Next.js frontend)

`isRTL(locale)` and `getTextDirection(locale)` are derived from the constant, so
adding a locale to `RTL_LOCALES` is all that is required to make it render RTL.

```ts
// frontend/lib/i18n/rtl.ts
export const RTL_LOCALES = ['ar', 'he', 'fa', 'ur'] as const;
export function getTextDirection(locale: string): 'ltr' | 'rtl' {
  return RTL_LOCALES.includes(locale as any) ? 'rtl' : 'ltr';
}
```

### Dynamic HTML direction

`frontend/app/layout.tsx` reads the active locale from the `NEXT_LOCALE` cookie
(never from browser heuristics) and renders:

```tsx
const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
const dir = getTextDirection(locale);

return <html lang={locale} dir={dir}>…</html>;
```

- `ar` / `he` → `<html dir="rtl">`
- `en` / `es` / other LTR locales → `<html dir="ltr">`

The locale store (`frontend/store/localeStore.ts`) persists the choice in the
cookie and flips `document.documentElement.dir` immediately on change. The
`LocaleProvider` syncs the server-rendered locale into the client store after
hydration, so there are **no hydration mismatches**.

### Tailwind `rtl:` variants

`frontend/tailwind.config.a11y.js` registers an `rtl:` variant:

```js
plugin(({ addVariant }) => {
  addVariant('rtl', '&:where([dir="rtl"], [dir="rtl"] *)');
});
```

This enables direction-aware utilities such as `rtl:ml-4`, `rtl:text-right`,
`rtl:flex-row-reverse`, `rtl:mr-0`, `rtl:pr-3`. Because the frontend ships its
own compiled CSS (`app/globals.css`) rather than a Tailwind build step, the same
logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end` and
RTL `space-x-*` swaps) are also defined there, scoped to `[dir="rtl"]` so LTR
layouts are unaffected.

### `useTextDirection()`

`frontend/hooks/useTextDirection.ts` returns the direction of the active locale:

```tsx
import { useTextDirection } from '@/hooks/useTextDirection';

function Header() {
  const direction = useTextDirection(); // 'ltr' | 'rtl'
  return <div dir={direction}>…</div>;
}
```

It reads the locale store and re-renders on locale changes.

### Building RTL-aware components

**`RtlContainer`** (`component-library/src/components/RtlContainer.tsx`) applies
the text direction to its subtree and optionally swaps the flex row direction:

```tsx
import { RtlContainer } from '@soroban-scanner/ui-components';

<RtlContainer dir={direction} className="app-shell">
  <nav>…</nav>
</RtlContainer>
```

It is direction-neutral by default (nothing is forced unless a prop asks for
it), renders as any element (`as`), and exposes its direction to descendants
via context.

**`RtlAwareIcon`** (`component-library/src/components/RtlAwareIcon.tsx`)
mirrors directional icons in RTL:

```tsx
import { RtlAwareIcon } from '@soroban-scanner/ui-components';

{/* Arrow/chevron — mirrored in RTL so it points along the reading direction */}
<RtlAwareIcon directional name="arrow-right" icon={<ArrowRight />} />

{/* Direction-neutral icon — never mirrored */}
<RtlAwareIcon name="search" icon={<Search />} />
```

### When directional icons should be mirrored

Mirror **arrows, chevrons and navigation indicators** (e.g. "back", "next",
"learn more", breadcrumb chevrons) so they point along the reading direction.
Do **not** mirror:

- direction-neutral icons (`search`, `settings`, `shield`, `plus`, …)
- icons that already show both directions (`arrows-left-right`, `chevrons-left-right`)
- chart/data indicators (`arrow-up-right` in a trend chart stays as drawn)

`RtlAwareIcon` only mirrors when `directional` is set (or the `name` is a known
directional icon); the default is no mirroring.

### How to add a new RTL locale

1. Add the locale code to `RTL_LOCALES` in all three places
   (`src/i18n/config.js`, `component-library/src/i18n/config.ts`,
   `frontend/lib/i18n/rtl.ts`).
2. Add translation files under `locales/<code>/common.json` and register the
   locale in the supported-languages lists.
3. No other layout code needs to change — direction is derived from the
   constant automatically.

### Accessibility considerations

- The `<html dir>` attribute is set from the active locale so screen readers
  and browsers apply correct bidirectional text handling.
- ARIA attributes that are **not** direction-dependent (`aria-label`,
  `aria-labelledby`, `aria-describedby`, `aria-required`, `aria-invalid`,
  `aria-live`, `aria-modal`) must **not** be swapped for RTL — only visual
  layout and directional icons change. `A11yPrimitives.tsx` documents this and
  uses logical CSS properties (`ms-*`, `start-*`) for spacing/positioning.
- Use `getDirectionalValue(direction, ltrValue, rtlValue)` from
  `A11yPrimitives.tsx` only when a value is genuinely direction-sensitive.

### How to test RTL layouts

- Unit tests: `RTL_LOCALES`, `isRTL`, `getTextDirection` (root, frontend and
  component-library suites).
- Hook test: `frontend/__tests__/useTextDirection.test.tsx`.
- Layout test: `frontend/__tests__/layout-dir.test.tsx` asserts `<html dir>`
  for `ar`, `he` and LTR locales.
- Component tests: `component-library/src/components/RtlContainer.test.tsx`,
  `RtlAwareIcon.test.tsx` and `frontend/__tests__/rtl-layout.test.tsx` verify
  RTL/LTR layout behaviour and icon mirroring.
- Tailwind/CSS tests: `frontend/__tests__/tailwind-rtl-variant.test.ts` and
  `frontend/__tests__/rtl-css.test.ts` verify the `rtl:` variant and the
  compiled RTL utilities.
- Visual check: set the `NEXT_LOCALE` cookie to `ar` or `he` and confirm the
  sidebar/navigation sits on the inline-end, form labels align to the start,
  and directional arrows point correctly; confirm `en`/`es` are unchanged.

## Adding New Languages

To add a new language:

1. **Create Translation File**
```bash
mkdir locales/fr
cp locales/en/common.json locales/fr/common.json
```

2. **Translate Content**
Edit `locales/fr/common.json` with French translations.

3. **Update Configuration**
Add the language to the supported languages list:

```javascript
// src/i18n/config.js
supportedLngs: ['en', 'es', 'ar', 'fr']
```

4. **Add RTL Support (if needed)**
If the new language is RTL, add it to the `RTL_LOCALES` constant (see above):

```javascript
// component-library/src/i18n/config.ts
export const RTL_LOCALES = ['ar', 'he', 'fa', 'ur', 'fr']; // if French was RTL
```

## Testing

Run the i18n test to verify the implementation:

```bash
node test-i18n.js
```

## Browser Compatibility

- **Modern Browsers**: Full support for all features
- **Legacy Browsers**: Basic i18n support (no RTL auto-detection)
- **Node.js**: Full CLI internationalization support

## Performance Considerations

- Translation files are loaded on-demand
- RTL styles are conditionally applied
- Language detection is cached
- Minimal runtime overhead

## Accessibility

- Proper `dir` attributes for screen readers
- Semantic HTML structure maintained
- ARIA labels for language controls
- High contrast mode support

## Troubleshooting

### Language Not Switching
- Check that translation files exist
- Verify language codes are correct
- Ensure i18n is initialized before use

### RTL Not Working
- Confirm language is in RTL list
- Check CSS classes are applied
- Verify document direction attribute

### Missing Translations
- Translation keys fall back to English
- Check console for missing key warnings
- Verify JSON structure is correct

## Contributing

When contributing to i18n:

1. **New Features**: Add translation keys for all supported languages
2. **Text Changes**: Update all translation files, not just English
3. **Testing**: Test with all languages, especially RTL
4. **Documentation**: Update this README for new features

## Future Enhancements

- **More Languages**: Easy to add additional language support
- **Pluralization**: Advanced plural rules for different languages
- **Gender**: Gender-specific translations where applicable
- **Region-Specific**: Country-specific formatting (en-US vs en-GB)
- **Dynamic Loading**: Lazy loading of translation files
- **Browser Detection**: Automatic language detection from browser settings
