import { readFileSync } from 'fs';
import { resolve } from 'path';

// The frontend ships its own compiled CSS (app/globals.css) rather than a
// Tailwind build step, so the RTL utilities must be present there to be
// available to the production build.
const globalsCss = readFileSync(resolve(__dirname, '../app/globals.css'), 'utf8');

// Normalise whitespace and quote style so the assertions survive prettier
// reformatting (single vs double quotes, one-line vs multi-line rules).
const normalize = (css: string): string => css.replace(/\s+/g, ' ').replace(/"/g, "'").trim();

const css = normalize(globalsCss);

describe('Frontend RTL CSS (app/globals.css)', () => {
  it('defines logical text alignment for RTL', () => {
    expect(css).toContain("[dir='rtl'] .text-start { text-align: right; }");
    expect(css).toContain("[dir='rtl'] .text-end { text-align: left; }");
  });

  it('defines logical margin utilities for RTL', () => {
    expect(css).toContain("[dir='rtl'] .ms-1");
    expect(css).toContain("[dir='rtl'] .me-2");
  });

  it('defines logical padding utilities for RTL', () => {
    expect(css).toContain("[dir='rtl'] .ps-3");
    expect(css).toContain("[dir='rtl'] .pe-4");
  });

  it('swaps horizontal space utilities in RTL', () => {
    expect(css).toContain("[dir='rtl'] .space-x-4 > * + *");
  });

  it('keeps LTR behaviour unchanged (base utilities stay physical)', () => {
    expect(css).toContain('.text-start { text-align: left; }');
    expect(css).toContain('.ms-1 { margin-left: 0.25rem; }');
  });
});
