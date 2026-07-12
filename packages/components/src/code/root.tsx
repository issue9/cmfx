// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, type ThemeProps } from '@cmfx/themes';
import type { BundledLanguage, BundledTheme } from 'shiki/bundle/full';
import { createEffect, createSignal, getOwner, type JSX, onCleanup, runWithOwner } from 'solid-js';
import { template } from 'solid-js/web';

import type { BaseRef, ChangeFunc, RefProps } from '@components/base';
import { type CodeDecorate, withDecorate } from './decorate';
import { highlight } from './shiki';

export type CodeRef = BaseRef<HTMLElement>;

export interface Base extends ThemeProps, RefProps<CodeRef> {
	/**
	 * 代码
	 *
	 * @reactive
	 */
	children: string;

	/**
	 * 内容自动换行
	 *
	 * @reactive
	 */
	wrap?: boolean;

	/**
	 * 高亮的语言名称，如果为空则为 text。
	 *
	 * @reactive
	 */
	lang?: BundledLanguage;

	/**
	 * 是否显示行号如果为 number 类型则表示起始行号。
	 *
	 * @reactive
	 */
	ln?: number;

	/**
	 * 主题名
	 *
	 * @reactive
	 */
	theme?: BundledTheme;

	/**
	 * 装饰器
	 *
	 * @reactive
	 */
	decorates?: Array<CodeDecorate>;
}

export interface CodeNormalProps extends Base {
	/**
	 * 是否可编辑
	 *
	 * @reactive
	 * @remarks
	 * 编辑内容并不会重新渲染内容，一些高亮内容可能不再准确。
	 */
	editable?: false;
}

export interface CodeEditableProps extends Base {
	/**
	 * 是否可编辑
	 *
	 * @reactive
	 * @remarks
	 * 编辑内容并不会重新渲染内容，一些高亮内容可能不再准确。
	 */
	editable: true;

	/**
	 * 修改内容触发的事件
	 *
	 * @remarks
	 * 仅在 {@link CodeProps#editable} 为 true 时生效。
	 */
	readonly onChange?: ChangeFunc<string>;
}

export type CodeProps = CodeEditableProps | CodeNormalProps;

/**
 * 代码显示组件
 *
 * @remarks
 * 默认并没有高亮功能，用户需要自己在 package.json 的 dependencies 中导入
 * [shiki](https://shiki.tmrs.site/) 该包才有高亮功能。
 */
export function Code(props: CodeProps): JSX.Element {
	const owner = getOwner();
	let dispose: (() => void) | undefined;
	const cancel = () => {
		if (dispose) {
			dispose();
			dispose = undefined;
		}
	};

	onCleanup(cancel);

	const [html, setHTML] = createSignal<string>(props.children);
	createEffect(() => setHTML(props.children));

	const [preElement, setPreElement] = createSignal<HTMLPreElement>();

	createEffect(async () => {
		cancel();

		const cls = joinClass(props.palette, props.class);
		const preHTML = await highlight(html(), props.lang, props.ln, props.wrap, cls, props.style, props.theme);
		const preElem = template(preHTML)() as HTMLPreElement;

		if (props.ref) {
			props.ref({
				root: () => preElem,
			});
		}

		setPreElement(preElem);
	});

	// 监视 editable 的变化
	createEffect(() => {
		const preElem = preElement();
		if (!preElem) {
			return;
		}

		preElem.contentEditable = props.editable ? 'plaintext-only' : 'false';
		preElem.addEventListener('change', e => {
			const txt = (e.currentTarget as HTMLElement).innerText;
			setHTML(txt);
			if (props.editable && props.onChange) {
				props.onChange(txt);
			}
		});
	});

	// 监视 decorates 的变化
	createEffect(() => {
		cancel();

		const preElem = preElement();
		if (!preElem) {
			return;
		}

		if (props.decorates) {
			dispose = runWithOwner(owner, () => withDecorate(preElem, ...props.decorates!));
		}
	});

	return <>{preElement()}</>;
}
