// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { BundledLanguage } from 'shiki';

import { borderDecorate, type CodeDecorate, copyButtonDecorate, createToolbarDecorate, withDecorate } from './decorate';
import { Code as C, type CodeEditableProps, type CodeNormalProps, type CodeProps, type CodeRef } from './root';
import { buildHighlighter, type CodeHighlighter, highlight } from './shiki';
import { shikiTheme } from './theme';

export const Code = Object.assign(C, {
	withDecorate,
	buildHighlighter,
	highlight,
	borderDecorate,
	copyButtonDecorate,
	createToolbarDecorate,
	theme: shikiTheme,
});

export namespace Code {
	export type Props = CodeProps;
	export type Ref = CodeRef;
	export type NormalProps = CodeNormalProps;
	export type EditableProps = CodeEditableProps;

	export type Highlighter = CodeHighlighter;
	export type Decorate = CodeDecorate;
	export type Language = BundledLanguage;
}
