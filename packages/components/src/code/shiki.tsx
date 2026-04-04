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

import { type BaseProps, joinClass, style2String } from '@components/base';
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
			decorate?: string,
		): string {
			return h.codeToHtml(code, buildOptions(code, lang, ln, wrap, cls, style, theme, decorate));
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
 * @param decorate - 装饰器名称，仅作记录，需要后续调用 withDecorate 才能在内容上有所显示，如果要指定多个，可以使用半角逗号分隔；
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
	decorate?: string,
): Promise<string> {
	return await codeToHtml(code, buildOptions(code, lang, ln, wrap, cls, style, theme, decorate));
}

function buildOptions(
	code: string,
	lang?: BundledLanguage,
	ln?: number,
	wrap?: boolean,
	cls?: string,
	style?: BaseProps['style'],
	theme?: BundledTheme,
	decorate?: string,
): CodeToHastOptions<BundledLanguage, BundledTheme> {
	// 行号列的宽度，即使只有两行代码，但是从 9 开始计算行号，还是得有 2 位长度，所以得根据最后一行的行号确定行号的宽度。
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
					node.properties['data-lang'] = lang;
					if (decorate) {
						node.properties['data-decorate'] = decorate;
					}
				},
			},
		],
	};
}
