'use client';

// component-library/src/components/DirectionContext.ts
//
// React context that lets RTL-aware components inherit the text direction
// from an enclosing RtlContainer. Resolution order for a component:
//   1. explicit `dir` prop
//   2. nearest RtlContainer ancestor (via this context)
//   3. the document direction (<html dir>)

import React from 'react';
import type { TextDirection } from '../utils/direction';

export const DirectionContext = React.createContext<TextDirection | undefined>(undefined);
