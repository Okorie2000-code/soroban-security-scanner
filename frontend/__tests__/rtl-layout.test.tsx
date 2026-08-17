import React from 'react';
import { render } from '@testing-library/react';
import { RtlContainer, RtlAwareIcon } from '@soroban-scanner/ui-components';
import {
  getDirectionalValue,
  StatusBadge,
  SkipLink,
} from '@/components/accessibility/A11yPrimitives';

// ── RTL vs LTR layout behaviour (component-level visual verification) ────────

describe('RTL layout behaviour', () => {
  it('renders an RTL app shell with dir="rtl" and mirrored directional icons', () => {
    const { container } = render(
      <RtlContainer dir="rtl" className="app-shell">
        {/* Header navigation flows right-to-left automatically under dir="rtl" */}
        <nav aria-label="Primary" className="nav">
          <RtlAwareIcon directional name="chevron-right" icon={<span>›</span>} />
          <span>Menu item</span>
        </nav>
      </RtlContainer>
    );

    const shell = container.querySelector('.app-shell');
    expect(shell?.getAttribute('dir')).toBe('rtl');

    // Directional icon is mirrored
    expect(container.innerHTML).toContain('scaleX(-1)');

    // Icon glyph order is kept stable via the inner dir="ltr" wrapper
    const iconWrapper = container.querySelector('span[dir="ltr"]');
    expect(iconWrapper).not.toBeNull();
  });

  it('does not mirror non-directional icons in RTL', () => {
    const { container } = render(
      <RtlContainer dir="rtl" className="app-shell">
        <RtlAwareIcon name="search" icon={<span>🔍</span>} />
      </RtlContainer>
    );
    expect(container.innerHTML).not.toContain('scaleX(-1)');
  });

  it('preserves LTR layouts exactly (no mirroring, dir="ltr")', () => {
    const { container } = render(
      <RtlContainer dir="ltr" className="app-shell">
        <nav aria-label="Primary" className="nav">
          <RtlAwareIcon directional name="chevron-right" icon={<span>›</span>} />
          <span>Menu item</span>
        </nav>
      </RtlContainer>
    );

    const shell = container.querySelector('.app-shell');
    expect(shell?.getAttribute('dir')).toBe('ltr');
    expect(container.innerHTML).not.toContain('scaleX(-1)');
  });

  it('keeps form labels direction-aware via logical alignment classes', () => {
    const { container } = render(
      <RtlContainer dir="rtl" className="app-shell">
        <form>
          <label className="text-start" htmlFor="scan-input">
            Contract address
          </label>
          <input id="scan-input" type="text" />
        </form>
      </RtlContainer>
    );
    // In RTL, start = right: the label uses the logical text-start utility
    expect(container.querySelector('label')?.className).toContain('text-start');
    // The form inherits rtl from the container
    expect(container.querySelector('form')?.closest('[dir="rtl"]')).not.toBeNull();
  });

  it('renders the same layout structure in LTR without RTL classes', () => {
    const { container } = render(
      <RtlContainer dir="ltr" className="app-shell">
        <form>
          <label className="text-start" htmlFor="scan-input">
            Contract address
          </label>
          <input id="scan-input" type="text" />
        </form>
      </RtlContainer>
    );
    expect(container.querySelector('.app-shell')?.getAttribute('dir')).toBe('ltr');
  });
});

// ── Direction-sensitive accessibility behaviour ──────────────────────────────

describe('A11yPrimitives direction-sensitive behaviour', () => {
  it('swaps direction-sensitive values with getDirectionalValue', () => {
    expect(getDirectionalValue('ltr', 'left', 'right')).toBe('left');
    expect(getDirectionalValue('rtl', 'left', 'right')).toBe('right');
  });

  it('keeps direction-neutral ARIA attributes identical in RTL (no blind swapping)', () => {
    const { container } = render(
      <RtlContainer dir="rtl">
        <StatusBadge severity="high" count={3} />
      </RtlContainer>
    );
    // aria-label is text, not a physical direction — must NOT be swapped
    expect(container.querySelector('[aria-label]')?.getAttribute('aria-label')).toBe(
      'High severity, 3 issues'
    );
    // Direction-sensitive spacing uses the logical ms-* utility
    expect(container.querySelector('.ms-0\\.5')).not.toBeNull();
  });

  it('uses logical start positioning for the skip link', () => {
    const { container } = render(<SkipLink />);
    expect(container.querySelector('a')?.className).toContain('focus:start-4');
  });
});
