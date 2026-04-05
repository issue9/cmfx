// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { BundledLanguage, BundledTheme } from 'shiki/bundle/full';
import { createEffect, createSignal, getOwner, type JSX, runWithOwner } from 'solid-js';
import { template } from 'solid-js/web';

import { type BaseProps, type BaseRef, joinClass, type RefProps } from '@components/base';
import { withDecorate } from './decorate';
import { highlight } from './shiki';

export type Ref = BaseRef<HTMLElement>;

export interface Props extends BaseProps, RefProps<Ref> {
	/**
	 * 代码
	 *
	 * @reactive
	 */
	children: string;

	/**
	 * 是否可编辑
	 *
	 * @reactive
	 * @remarks
	 * 编辑内容并不会重新渲染内容，一些高亮内容可能不再准确。
	 */
	editable?: boolean;

	/**
	 * 修改内容触发的事件
	 *
	 * @remarks
	 * 仅在 {@link Props#editable} 为 true 时生效。
	 */
	oninput?: (value: string) => void;

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
	 * 装饰器名称
	 *
	 * @remarks
	 * 该值可由 {@link getDecorates} 获取。
	 */
	decorates?: Array<string>;
}

/**
 * 代码显示组件
 *
 * @remarks
 * 默认并没有高亮功能，用户需要自己在 package.json 的 dependencies 中导入
 * [shiki](https://shiki.tmrs.site/) 该包才有高亮功能。
 */
export function Root(props: Props): JSX.Element {
	const [html, setHTML] = createSignal<HTMLElement>();
	const owner = getOwner();

	createEffect(async () => {
		const cls = joinClass(props.palette, props.class);
		const pre = await highlight(
			props.children,
			props.lang,
			props.ln,
			props.wrap,
			cls,
			props.style,
			props.theme,
			props.decorates?.join(','),
		);
		setHTML(template(pre)() as HTMLElement);

		if (props.ref) {
			props.ref({
				root: () => html()!,
			});
		}
	});

	createEffect(() => {
		const el = html();
		if (!el) {
			return;
		}

		el.contentEditable = props.editable ? 'plaintext-only' : 'false';
		el.addEventListener('input', e => {
			const txt = (e.currentTarget as HTMLElement).innerText;
			props.children = txt;
			if (props.oninput) {
				props.oninput(txt);
			}
		});

		runWithOwner(owner, () => withDecorate(el));
	});

	return <>{html()}</>;
}
