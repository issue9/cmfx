// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Marked, type Token, type TokenizerAndRendererExtension } from 'marked';
import type { JSX, ValidComponent } from 'solid-js';
import { createEffect, createSignal, getOwner, runWithOwner } from 'solid-js';
import { Dynamic, render } from 'solid-js/web';

import type { BaseProps, BaseRef, RefProps } from '@components/base';
import { joinClass } from '@components/base';
import { Code } from '@components/code';
import styles from './style.module.css';

export type Ref<T extends keyof HTMLElementTagNameMap = 'article'> = BaseRef<
	T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : HTMLElement
>;

export interface Props<T extends keyof HTMLElementTagNameMap = 'article'> extends BaseProps, RefProps<Ref<T>> {
	/**
	 * markdown 文本内容
	 *
	 * @reactive
	 */
	text?: string;

	/**
	 * 指定渲染的组件
	 */
	components?: Record<string, () => JSX.Element>;

	/**
	 * 自定义标签
	 *
	 * @defaultValue 'article'
	 */
	tag?: T;
}

/**
 * 预览 markdown 文档的组件
 *
 * @remarks
 * 需要需要支持代码高亮，可参考 {@link Code} 的实现。
 *
 * 还支持将组件渲染到最终的输出结果中，分为代码一样，分为 inline 和 block。
 *  - inline 为 @`id`@，最终会生成一个 `<span></span>` 元素，并从 {@link Props#components} 中获取对应的组件渲染到元素之内。
 *  - block 为 `@```id```@`，最终会生成一个 `<div></div>` 元素，并从 {@link Props#components} 中获取对应的组件渲染到元素之内。
 */
export function Root<T extends keyof HTMLElementTagNameMap = 'article'>(props: Props<T>): JSX.Element {
	const tag = props.tag ?? 'article';
	const owner = getOwner();
	const p = new Marked({
		extensions: [componentBlockExtension, componentInlineExtension],
		walkTokens: code(),
	});

	const [html, setHTML] = createSignal(props.text);
	let ref: HTMLElement;

	createEffect(async () => {
		const ht = await p.parse(props.text || '', { async: true });
		setHTML(ht);

		requestAnimationFrame(() => {
			if (!props.components) {
				return;
			}
			Object.entries(props.components).forEach(([id, fn]) => {
				ref.querySelectorAll(`[data-markdown-component="${id}"]`)?.forEach(el => {
					runWithOwner(owner, () => {
						render(fn, el);
					});
				});
			});
		});
	});

	return (
		<Dynamic
			component={tag as ValidComponent}
			class={joinClass(props.palette, props.class)}
			style={props.style}
			innerHTML={html()}
			ref={(el: ReturnType<Ref<T>['root']>) => {
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
				Object.assign(token, {
					type: 'html',
					block: true,
					text: await Code.highlight(token.text, token.lang, undefined, true, styles.code),
				});
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
