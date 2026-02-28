// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type {
	BundledLanguage,
	BundledTheme,
	CodeToHastOptions,
	HighlighterGeneric,
	SpecialTheme,
	StringLiteralUnion,
	ThemeInput,
} from 'shiki/bundle/full';
import { codeToHtml, createHighlighter } from 'shiki/bundle/full';

import { BaseProps, joinClass, style2String } from '@components/base';
import { copy2Clipboard } from '@components/context';
import styles from './style.module.css';
import { shikiTheme } from './theme';

window.copyShikiCode2Clipboard = copy2Clipboard;

declare global {
	interface Window {
		copyShikiCode2Clipboard: typeof copy2Clipboard;
	}
}

/**
 * 提供特定语言的代码高亮功能
 *
 * @remarks 与 {@link highlight} 的区别在于：
 *  - Highlighter 提供的高亮方法是同步的，而 {@link highlight} 是异步的；
 *  - Highlighter 在不使用时需要手动清除对象；
 * 用户需要自己在 package.json 的 dependencies 中导入
 * [shiki](https://shiki.tmrs.site/) 该包才有高亮功能。
 */
export class Highlighter {
	/**
	 * 构造可以高亮指定语言的对象
	 *
	 * @param langs - 语言 ID 列表；
	 * @param themes - 主题列表，可以为空，表示使用默认主题；
	 * @returns 返回 {@link Highlighter} 对象；
	 */
	static async build(
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
		return new Highlighter(h);
	}

	#highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>;

	private constructor(h: HighlighterGeneric<BundledLanguage, BundledTheme>) {
		this.#highlighter = h;
	}

	/**
	 * 高亮代码
	 * @param code - 代码；
	 * @param lang - 语言 ID；
	 * @param ln - 起始行号，undefined 表示不显示行号；
	 * @param wrap - 是否换行；
	 * @param cls - 传递给 pre 标签的 CSS 类名；
	 * @param style - 传递给 pre 标签的 CSS 样式；
	 * @param simple - 简单模式，没有复制按钮，也没有语言名称，对于单行的代码可使用此方式；
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
		simple?: boolean,
		theme?: BundledTheme,
	): string {
		return this.#highlighter.codeToHtml(code, buildOptions(code, lang, ln, wrap, cls, style, simple, theme));
	}

	/**
	 * 释放当前对象
	 */
	dispose() {
		this.#highlighter.dispose();
	}
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
 * @param simple - 简单模式，没有复制按钮，也没有语言名称，对于单行的代码可使用此方式；
 * @param theme - 主题名称。可以为空，表示使用默认主题，默认主题会根据整个框架的主题而变化；
 * @returns 高亮后的 HTML 代码；
 *
 * @remarks 用户需要自己在 package.json 的 dependencies 中导入
 * [shiki](https://shiki.tmrs.site/) 该包才有高亮功能。
 */
export async function highlight(
	code: string,
	lang?: BundledLanguage,
	ln?: number,
	wrap?: boolean,
	cls?: string,
	style?: BaseProps['style'],
	simple?: boolean,
	theme?: BundledTheme,
): Promise<string> {
	return await codeToHtml(code, buildOptions(code, lang, ln, wrap, cls, style, simple, theme));
}

function buildOptions(
	code: string,
	lang?: BundledLanguage,
	ln?: number,
	wrap?: boolean,
	cls?: string,
	style?: BaseProps['style'],
	simple?: boolean,
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

					if (!simple) {
						if (lang) {
							// 显示语言标签
							node.children.unshift({
								type: 'element',
								tagName: 'i',
								properties: { class: styles.lang },
								children: [{ type: 'text', value: lang }],
							});
						}

						node.children.push({
							// 复制按钮
							type: 'element',
							tagName: 'button',
							properties: {
								class: styles.action,
								onclick: `window.copyShikiCode2Clipboard(this, '${code.replace(/'/g, "\\'").replace(/\n/g, '\\\n')}')`,
							},
							children: [
								{
									// 图标：material-symbols:content-copy
									type: 'element',
									tagName: 'svg',
									properties: {
										width: '24',
										height: '24',
										viewBox: '0 0 24 24',
									},
									children: [
										{
											type: 'element',
											tagName: 'path',
											properties: {
												fill: 'currentColor',
												d: 'M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm-4 4q-.825 0-1.412-.587T3 20V6h2v14h11v2z',
											},
											children: [],
										},
									],
								},
							],
						});
					}
				}, // end pre()
			},
		],
	};
}
