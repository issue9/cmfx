// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { getDecorates, registerDecorate, withDecorate } from './decorate';
import { Code as C } from './root';
import { buildHighlighter, highlight } from './shiki';

export const Code = Object.assign(C, {
	decorates: getDecorates,
	registerDecorate,
	withDecorate,
	buildHighlighter,
	highlight,
});

export namespace Code {
	export type Props = import('./root').CodeProps;
	export type Ref = import('./root').CodeRef;
	export type Highlighter = import('./shiki').CodeHighlighter;
	export type Decorate = import('./decorate').CodeDecorate;
}
