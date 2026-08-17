import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RtlContainer } from './RtlContainer';

describe('RtlContainer', () => {
  it('applies dir="rtl" for RTL', () => {
    const html = renderToStaticMarkup(<RtlContainer dir="rtl">content</RtlContainer>);
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('content');
  });

  it('applies dir="ltr" for LTR', () => {
    const html = renderToStaticMarkup(<RtlContainer dir="ltr">content</RtlContainer>);
    expect(html).toContain('dir="ltr"');
  });

  it('defaults to ltr when no direction is available (SSR / node)', () => {
    const html = renderToStaticMarkup(<RtlContainer>content</RtlContainer>);
    expect(html).toContain('dir="ltr"');
  });

  it('swaps flex direction when reverse is set in RTL', () => {
    const html = renderToStaticMarkup(
      <RtlContainer dir="rtl" reverse style={{ display: 'flex' }}>
        content
      </RtlContainer>
    );
    expect(html).toContain('flex-direction:row-reverse');
  });

  it('does not swap flex direction in LTR when reverse is set', () => {
    const html = renderToStaticMarkup(
      <RtlContainer dir="ltr" reverse>
        content
      </RtlContainer>
    );
    expect(html).not.toContain('flex-direction');
  });

  it('is direction-neutral by default (no forced RTL behaviour)', () => {
    const html = renderToStaticMarkup(<RtlContainer dir="ltr">content</RtlContainer>);
    expect(html).not.toContain('flex-direction');
  });

  it('preserves semantics when rendering as another element', () => {
    const html = renderToStaticMarkup(
      <RtlContainer as="section" dir="rtl" aria-label="section">
        content
      </RtlContainer>
    );
    expect(html).toContain('<section dir="rtl"');
  });
});
