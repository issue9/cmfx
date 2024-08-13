// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export { changeMode, getMode, modes } from './mode';
export type { Mode } from './mode';

export { changeContrast, contrasts, getContrast } from './contrast';
export type { Contrast } from './contrast';

export { changeScheme, genScheme, getScheme } from './scheme';
export type { Scheme } from './scheme';

export { Breakpoints, breakpoints } from './breakpoints';
export type { Breakpoint, BreakpointChange } from './breakpoints';

export { init as initTheme } from './theme';
