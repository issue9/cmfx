// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Marked, type Token, type TokenizerAndRendererExtension } from 'marked';
import type { JSX, ValidComponent } from 'solid-js';
import { createEffect, createSignal, getOwner, onCleanup, runWithOwner } from 'solid-js';
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

	/**
	 * 在完成渲染时的回调
	 */
	onComplete?: () => void;
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

	const disposes: Array<() => void> = [];
	const cancel = () => {
		if (disposes.length === 0) {
			return;
		}

		for (const d of disposes) {
			d();
		}
		disposes.length = 0;
	};

	onCleanup(() => cancel());

	// 监视文本是否修改
	createEffect(async () => {
		cancel();

		const ht = await p.parse(props.text || '', { async: true });
		setHTML(ht);

		// 需要等待文本内容在 dom 已经渲染完了，再将组件挂载在对应在的位置
		requestAnimationFrame(() => {
			if (!props.components) {
				if (props.onComplete) {
					props.onComplete();
				}
				return;
			}

			Object.entries(props.components).forEach(([id, fn]) => {
				ref.querySelectorAll(`[data-markdown-component="${id}"]`)?.forEach(el => {
					runWithOwner(owner, () => disposes.push(render(fn, el)));
				});
			});

			if (props.onComplete) {
				props.onComplete();
			}

			if (ref) {
				runWithOwner(owner, () => disposes.push(Code.withDecorate(ref)));
			}
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
				{
					const langs = token.lang.split(' ');
					Object.assign(token, {
						type: 'html',
						block: true,
						lang: langs[0],
						text: await Code.highlight(
							token.text,
							langs[0],
							undefined,
							true,
							undefined,
							undefined,
							undefined,
							langs[1],
						),
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
