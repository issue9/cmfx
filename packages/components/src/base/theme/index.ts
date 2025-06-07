// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

export { changeMode, modes } from './mode';
export type { Mode } from './mode';

export { changeContrast, contrasts } from './contrast';
export type { Contrast } from './contrast';

export { changeScheme, genScheme, genSchemes } from './scheme';
export type { Scheme } from './scheme';

export { applyTheme, breakpoints, hasTheme, transitionDuration } from './theme';
export type { Breakpoint, Theme } from './theme';

import './theme.css';
