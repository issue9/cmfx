// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Markdown as C, type MarkdownProps, type MarkdownRef } from './root';

export const Markdown = C;

export namespace Markdown {
	export type Props<T extends keyof HTMLElementTagNameMap = 'article'> = MarkdownProps<T>;
	export type Ref<T extends keyof HTMLElementTagNameMap = 'article'> = MarkdownRef<T>;
}
