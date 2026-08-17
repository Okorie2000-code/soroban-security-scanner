import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RtlContainer } from './RtlContainer';
import { RtlAwareIcon, isDirectionalIconName, DIRECTIONAL_ICON_NAMES } from './RtlAwareIcon';

const Arrow = () => <svg data-testid="arrow" />;

describe('RtlAwareIcon', () => {
  it('mirrors directional icons in RTL', () => {
    const html = renderToStaticMarkup(<RtlAwareIcon directional dir="rtl" icon={<Arrow />} />);
    expect(html).toContain('transform:scaleX(-1)');
  });

  it('does not mirror directional icons in LTR', () => {
    const html = renderToStaticMarkup(<RtlAwareIcon directional dir="ltr" icon={<Arrow />} />);
    expect(html).not.toContain('scaleX(-1)');
  });

  it('does not mirror non-directional icons in RTL', () => {
    const html = renderToStaticMarkup(<RtlAwareIcon dir="rtl" icon={<Arrow />} />);
    expect(html).not.toContain('scaleX(-1)');
  });

  it('auto-detects directional icons by name in RTL', () => {
    const html = renderToStaticMarkup(
      <RtlAwareIcon name="chevron-right" dir="rtl" icon={<Arrow />} />
    );
    expect(html).toContain('transform:scaleX(-1)');
  });

  it('does not mirror direction-neutral icons by name in RTL', () => {
    const html = renderToStaticMarkup(<RtlAwareIcon name="search" dir="rtl" icon={<Arrow />} />);
    expect(html).not.toContain('scaleX(-1)');
  });

  it('inherits direction from an enclosing RtlContainer', () => {
    const html = renderToStaticMarkup(
      <RtlContainer dir="rtl">
        <RtlAwareIcon directional icon={<Arrow />} />
      </RtlContainer>
    );
    expect(html).toContain('transform:scaleX(-1)');
  });

  it('renders the icon content unchanged', () => {
    const html = renderToStaticMarkup(<RtlAwareIcon dir="ltr" icon={<Arrow />} />);
    expect(html).toContain('data-testid="arrow"');
  });

  it('exposes directional icon helpers', () => {
    expect(isDirectionalIconName('arrow-left')).toBe(true);
    expect(isDirectionalIconName('chevron-right')).toBe(true);
    expect(isDirectionalIconName('search')).toBe(false);
    expect(DIRECTIONAL_ICON_NAMES).toContain('arrow-right');
  });
});
