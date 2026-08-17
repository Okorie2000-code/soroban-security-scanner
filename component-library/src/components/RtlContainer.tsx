'use client';

// component-library/src/components/RtlContainer.tsx
//
// RTL-aware layout wrapper. Applies the active text direction to its subtree
// and optionally swaps the flex row direction for RTL. Direction-neutral by
// default — nothing is forced unless a prop asks for it.

import React, { useContext, useEffect, useState } from 'react';
import { getDocumentDirection } from '../utils/direction';
import type { TextDirection } from '../utils/direction';
import { DirectionContext } from './DirectionContext';

export interface RtlContainerProps extends React.HTMLAttributes<HTMLElement> {
  /** Render as this element (defaults to `<div>`) — preserve semantics. */
  as?: React.ElementType;
  /** Swap the flex row direction when RTL (`flex-direction: row-reverse`). */
  reverse?: boolean;
  /**
   * Explicit direction. When omitted, inherits from the document direction
   * (`<html dir>`), which the app sets from the active locale.
   */
  dir?: TextDirection;
  children?: React.ReactNode;
}

export function RtlContainer({
  as: Tag = 'div',
  reverse = false,
  dir,
  style,
  children,
  ...rest
}: RtlContainerProps) {
  const parentDir = useContext(DirectionContext);

  // Initialise to 'ltr' on both server and client so the first client render
  // matches the server render; the document direction is picked up after
  // hydration to avoid hydration mismatches in Next.js.
  const [documentDir, setDocumentDir] = useState<TextDirection>('ltr');

  useEffect(() => {
    if (dir === undefined && parentDir === undefined) {
      setDocumentDir(getDocumentDirection());
    }
  }, [dir, parentDir]);

  const resolvedDir = dir ?? parentDir ?? documentDir;
  const isRTL = resolvedDir === 'rtl';

  return (
    <DirectionContext.Provider value={resolvedDir}>
      <Tag
        dir={resolvedDir}
        style={{
          // flex rows follow the writing direction automatically; `reverse`
          // opts into the opposite order for RTL when the layout requires it.
          ...(reverse && isRTL ? { flexDirection: 'row-reverse' } : null),
          ...style,
        }}
        {...(rest as React.HTMLAttributes<HTMLElement>)}
      >
        {children}
      </Tag>
    </DirectionContext.Provider>
  );
}

export default RtlContainer;
