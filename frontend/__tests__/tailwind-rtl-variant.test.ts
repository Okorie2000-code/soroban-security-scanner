import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

// Load the a11y Tailwind config (contains the `rtl:` variant plugin)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const a11yConfig = require('../tailwind.config.a11y.js');

async function compileWith(content: string): Promise<string> {
  const result = await postcss([
    tailwindcss({
      ...a11yConfig,
      content: [{ raw: content, extension: 'html' }],
    }),
  ]).process('@tailwind utilities;', { from: undefined });
  return result.css;
}

describe('Tailwind rtl: variant (tailwind.config.a11y.js)', () => {
  it('generates [dir="rtl"]-scoped margin utilities', async () => {
    const css = await compileWith('<div class="rtl:ml-4 rtl:mr-0"></div>');
    expect(css).toContain('[dir="rtl"]');
    expect(css).toContain('margin-left');
    expect(css).toContain('margin-right');
  });

  it('generates [dir="rtl"]-scoped padding utilities', async () => {
    const css = await compileWith('<div class="rtl:pr-3 rtl:pl-0"></div>');
    expect(css).toContain('[dir="rtl"]');
    expect(css).toContain('padding-right');
  });

  it('generates [dir="rtl"]-scoped text alignment', async () => {
    const css = await compileWith('<div class="rtl:text-right"></div>');
    expect(css).toContain('[dir="rtl"]');
    expect(css).toContain('text-align: right');
  });

  it('generates [dir="rtl"]-scoped flex direction', async () => {
    const css = await compileWith('<div class="rtl:flex-row-reverse"></div>');
    expect(css).toContain('[dir="rtl"]');
    expect(css).toContain('flex-direction: row-reverse');
  });
});
