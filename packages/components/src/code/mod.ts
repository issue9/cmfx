// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

export type { Decorate } from './decorate';
export { getDecorates as decorates, registerDecorate, withDecorate } from './decorate';
export type { Props as RootProps, Ref as RootRef } from './root';
export { Root } from './root';
export { buildHighlighter, type Highlighter, highlight } from './shiki';
