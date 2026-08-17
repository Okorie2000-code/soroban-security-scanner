'use client';

// component-library/src/components/RtlAwareIcon.tsx
//
// RTL-aware icon wrapper. Directional icons (arrows, chevrons, navigation
// indicators) are mirrored with `transform: scaleX(-1)` in RTL; all other
// icons render untouched. The wrapper is opt-in — icons are never mirrored
// unless marked directional (explicitly or by a known directional name).

import React, { useContext, useEffect, useState } from 'react';
import { getDocumentDirection } from '../utils/direction';
import type { TextDirection } from '../utils/direction';
import { DirectionContext } from './DirectionContext';

/**
 * Directional icon names that should mirror in RTL (arrows, chevrons,
 * navigation indicators). Icons not listed here are direction-neutral and
 * must NOT be mirrored.
 */
export const DIRECTIONAL_ICON_NAMES = [
  'arrow-down-left',
  'arrow-down-right',
  'arrow-left',
  'arrow-right',
  'arrow-up-left',
  'arrow-up-right',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'chevrons-down',
  'chevrons-left',
  'chevrons-right',
  'chevrons-up',
  'corner-down-left',
  'corner-down-right',
  'corner-up-left',
  'corner-up-right',
  'move-left',
  'move-right',
  'redo',
  'redo-2',
  'undo',
  'undo-2',
] as const;

export type DirectionalIconName = (typeof DIRECTIONAL_ICON_NAMES)[number];

/** Returns `true` when the icon name is a directional icon. */
export function isDirectionalIconName(name: string): boolean {
  return (DIRECTIONAL_ICON_NAMES as readonly string[]).includes(name);
}

export interface RtlAwareIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The icon to render (any React node — SVG, lucide icon, emoji, …). */
  icon: React.ReactNode;
  /** Optional icon name used to auto-detect directional icons. */
  name?: string;
  /** Explicitly mirror this icon in RTL; overrides `name` detection. */
  directional?: boolean;
  /**
   * Explicit direction. When omitted, inherits from the document direction
   * (`<html dir>`), which the app sets from the active locale.
   */
  dir?: TextDirection;
}

export function RtlAwareIcon({
  icon,
  name,
  directional,
  dir,
  style,
  className,
  ...rest
}: RtlAwareIconProps) {
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
  const isDirectional = directional ?? (name ? isDirectionalIconName(name) : false);
  const shouldMirror = isDirectional && resolvedDir === 'rtl';

  return (
    <span
      // Keep the glyph order stable; mirroring is done with a transform only.
      dir="ltr"
      className={className}
      style={{
        display: 'inline-block',
        ...(shouldMirror ? { transform: 'scaleX(-1)' } : null),
        ...style,
      }}
      {...rest}
    >
      {icon}
    </span>
  );
}

export default RtlAwareIcon;
