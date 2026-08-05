// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, type ThemeProps } from '@cmfx/themes';
import { Marked, type Token, type TokenizerAndRendererExtension } from 'marked';
import type { JSX, ValidComponent } from 'solid-js';
import { createEffect, createSignal, getOwner, onCleanup, runWithOwner } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type { BaseRef, RefProps } from '@components/base';
import { Code } from '@components/code';
import styles from './style.module.css';

export type MarkdownRef<T extends keyof HTMLElementTagNameMap = 'article'> = BaseRef<
	T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : HTMLElement
>;

export interface MarkdownProps<T extends keyof HTMLElementTagNameMap = 'article'>
	extends ThemeProps,
		RefProps<MarkdownRef<T>> {
	/**
	 * markdown 文本内容
	 *
	 * @reactive
	 */
	text?: string;

	/**
	 * 自定义标签
	 *
	 * @defaultValue 'article'
	 */
	readonly tag?: T;

	/**
	 * 在完成渲染时的回调
	 */
	readonly onComplete?: () => void;

	readonly decorates?: Code.Props['decorates'];
}

/**
 * 预览 markdown 文档的组件
 *
 * @remarks
 * 需要需要支持代码高亮，可参考 {@link Code} 的实现。
 */
export function Markdown<T extends keyof HTMLElementTagNameMap = 'article'>(props: MarkdownProps<T>): JSX.Element {
	const tag = props.tag ?? 'article';
	const owner = getOwner();
	const p = new Marked({
		extensions: [componentBlockExtension, componentInlineExtension],
		walkTokens: code(),
	});

	const [html, setHTML] = createSignal(props.text);
	let ref: HTMLElement;

	const disposes: Array<(() => void) | undefined> = [];
	const cancel = () => {
		if (disposes.length > 0) {
			disposes.map(d => d?.());
			disposes.length = 0;
		}
	};

	onCleanup(() => cancel());

	// 监视文本是否修改
	createEffect(async () => {
		cancel();

		const ht = await p.parse(props.text || '', { async: true });
		setHTML(ht);

		// 需要等待文本内容在 dom 已经渲染完了，再将组件挂载在对应在的位置
		requestAnimationFrame(() => {
			props.onComplete?.();

			if (ref && props.decorates) {
				disposes.push(runWithOwner(owner, () => Code.withDecorate(ref, ...props.decorates!)));
			}
		});
	});

	return (
		<Dynamic
			component={tag as ValidComponent}
			class={joinClass(props.palette, props.class)}
			style={props.style}
			innerHTML={html()}
			ref={(el: ReturnType<MarkdownRef<T>['root']>) => {
				ref = el;
				if (props.ref) {
					props.ref({ root: () => el });
				}
			}}
		/>
	);
}

function code() {
	return async (token: Token) => {
		switch (token.type) {
			case 'code':
				{
					Object.assign(token, {
						type: 'html',
						block: true,
						lang: token.lang,
						text: await Code.highlight(token.text, token.lang, undefined, true, undefined, undefined, undefined),
					});
				}
				break;
		}
	};
}

interface BlockComponentToken {
	type: 'blockComponent';
	id: string; // 根据此值查找指定的组件
	raw: string;
}

interface InlineComponentToken {
	type: 'inlineComponent';
	id: string; // 根据此值查找指定的组件
	raw: string;
}

const componentBlockExtension: TokenizerAndRendererExtension = {
	name: 'blockComponent',
	level: 'block',
	start(src: string) {
		return src.match(/@```/)?.index;
	},
	tokenizer(src: string) {
		const match = src.match(/^@```(.+?)```@/);
		if (match) {
			return {
				type: 'blockComponent',
				raw: match[0],
				id: match[1],
			} satisfies BlockComponentToken;
		}
	},
	renderer(token) {
		return `<div class="${styles.contents}" data-markdown-component="${token.id}"></div>`;
	},
};

const componentInlineExtension: TokenizerAndRendererExtension = {
	name: 'inlineComponent',
	level: 'inline',
	start(src: string) {
		return src.match(/@`/)?.index;
	},
	tokenizer(src: string) {
		const match = src.match(/^@`(.+?)`@/);
		if (match) {
			return {
				type: 'inlineComponent',
				raw: match[0],
				id: match[1],
			} satisfies InlineComponentToken;
		}
	},
	renderer(token) {
		return `<span class="${styles.contents}" data-markdown-component="${token.id}"></span>`;
	},
};
