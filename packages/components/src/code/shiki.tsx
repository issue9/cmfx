// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type {
	BundledLanguage,
	BundledTheme,
	CodeToHastOptions,
	SpecialTheme,
	StringLiteralUnion,
	ThemeInput,
} from 'shiki/bundle/full';
import { codeToHtml, createHighlighter } from 'shiki/bundle/full';
import { render } from 'solid-js/web';

import { type BaseProps, joinClass, style2String } from '@components/base';
import { Button } from '@components/button';
import { CopyIcon } from '@components/icon';
import styles from './style.module.css';
import { shikiTheme } from './theme';

export interface Highlighter {
	/**
	 * 高亮代码
	 * @param code - 代码；
	 * @param lang - 语言 ID；
	 * @param ln - 起始行号，undefined 表示不显示行号；
	 * @param wrap - 是否换行；
	 * @param cls - 传递给 pre 标签的 CSS 类名；
	 * @param style - 传递给 pre 标签的 CSS 样式；
	 * @param theme - 主题名称。可以为空，表示使用默认主题，默认主题会根据整个框架的主题而变化；
	 * @returns 高亮处理之后的 html 代码；
	 */
	html(
		code: string,
		lang: BundledLanguage,
		ln?: number,
		wrap?: boolean,
		cls?: string,
		style?: BaseProps['style'],
		theme?: BundledTheme,
	): string;

	/**
	 * 释放当前对象
	 */
	dispose(): void;
}

/**
 * 构造可以高亮指定语言的对象
 *
 * @param langs - 语言 ID 列表；
 * @param themes - 主题列表，可以为空，表示使用默认主题；
 * @returns 返回 {@link Highlighter} 对象；
 *
 * @remarks
 * 用户需要自己在 package.json 的 dependencies 中导入
 * [shiki](https://shiki.tmrs.site/) 该包才有高亮功能。
 */
export async function buildHighlighter(
	langs: Array<BundledLanguage>,
	// BundledHighlighterOptions['themes'] 的类型不太对，暂时只能这样写了。
	themes?: (ThemeInput | StringLiteralUnion<BundledTheme> | SpecialTheme)[],
): Promise<Highlighter> {
	if (themes) {
		themes.push(shikiTheme);
	} else {
		themes = [shikiTheme];
	}

	const h = await createHighlighter({ themes: themes, langs: langs });

	return {
		html(
			code: string,
			lang: BundledLanguage,
			ln?: number,
			wrap?: boolean,
			cls?: string,
			style?: BaseProps['style'],
			theme?: BundledTheme,
		): string {
			return h.codeToHtml(code, buildOptions(code, lang, ln, wrap, cls, style, theme));
		},

		dispose: () => h.dispose(),
	};
}

/**
 * 高亮代码
 *
 * @param code - 代码文本；
 * @param lang - 语言名称，默认为 text；
 * @param ln - 起始行号，不需要则为 undefined；
 * @param wrap - 是否自动换行；
 * @param cls - 传递给 pre 标签的 CSS 类名；
 * @param style - 传递给 pre 标签的 CSS 样式；
 * @param theme - 主题名称。可以为空，表示使用默认主题，默认主题会根据整个框架的主题而变化；
 * @returns 高亮后的 HTML 代码；
 *
 * @remarks
 * 用户需要自己在 package.json 的 dependencies 中导入
 * [shiki](https://shiki.tmrs.site/) 该包才有高亮功能。
 */
export async function highlight(
	code: string,
	lang?: BundledLanguage,
	ln?: number,
	wrap?: boolean,
	cls?: string,
	style?: BaseProps['style'],
	theme?: BundledTheme,
): Promise<string> {
	return await codeToHtml(code, buildOptions(code, lang, ln, wrap, cls, style, theme));
}

function buildOptions(
	code: string,
	lang?: BundledLanguage,
	ln?: number,
	wrap?: boolean,
	cls?: string,
	style?: BaseProps['style'],
	theme?: BundledTheme,
): CodeToHastOptions<BundledLanguage, BundledTheme> {
	// 行号列的宽度，即使只有两行代码，但是从 9 开始计算行号，还是得有 2 位长度。
	const w = ln === undefined ? '0ch' : `${(code.split('\n').length + ln).toString().length}ch`;
	const s = style2String(`;--line-number-start: ${ln ?? 0};--line-number-width: ${w}`, style);

	return {
		lang: lang || 'text',
		theme: theme ?? shikiTheme,
		transformers: [
			{
				pre(node) {
					node.properties.class = joinClass(
						undefined,
						node.properties.class as string | null | undefined,
						ln !== undefined ? styles.ln : '',
						wrap ? styles.wrap : '',
						cls,
					);
					node.properties.style += s;
					node.properties['data-code'] = code;
				},
			},
		],
	};
}

/**
 * 为所有的 shiki 代码块添加复制按钮
 */
export function withCopyButton(elem: HTMLElement) {
	if (elem.matches('[data-code]')) {
		mountCopyButton(elem);
		return;
	}

	const elems = elem.querySelectorAll('[data-code]');
	for (const elem of elems) {
		mountCopyButton(elem as HTMLElement);
	}
}

function mountCopyButton(el: HTMLElement) {
	let icons: CopyIcon.RootRef;
	render(
		() => (
			<Button.Root
				class={styles.action}
				square
				kind="flat"
				onclick={() => icons?.root().root().dispatchEvent(new Event('click'))}
			>
				<CopyIcon.Root ref={el => (icons = el)} getText={async () => el.dataset.code ?? ''} />
			</Button.Root>
		),
		el,
	);
}
