// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { classList, joinClass, type ThemeProps } from '@cmfx/themes';
import type { JSX, ParentProps } from 'solid-js';

import type { DialogRef } from './context';
import { DialogProvider } from './context';
import styles from './style.module.css';

export interface DialogProps extends ThemeProps, ParentProps {
	// https://caniuse.com/?search=closedby
	// closedby

	ref: (m: DialogRef) => void;

	/**
	 * 指定标题内容
	 *
	 * @reactive
	 */
	header?: JSX.Element;

	/**
	 * 底部的按钮
	 *
	 * @reactive
	 */
	footer?: JSX.Element;

	/**
	 * 内容是否可滚动
	 *
	 * @reactive
	 */
	scrollable?: boolean;

	mainClass?: string;
}

function buildRef(ref: HTMLDialogElement): DialogRef {
	return {
		root(): HTMLDialogElement {
			return ref;
		},

		move(p?: { x: number | string; y: number | string }): void {
			if (!p) {
				ref.style.insetInlineStart = '50%';
				ref.style.insetBlockStart = '50%';
				ref.style.translate = 'var(--tw-translate-x) var(--tw-translate-y)';
				return;
			}

			ref.style.translate = '0px 0px';
			ref.style.insetInlineStart = typeof p.x === 'string' ? p.x : `${p.x}px`;
			ref.style.insetBlockStart = typeof p.y === 'string' ? p.y : `${p.y}px`;
		},
	};
}

/**
 * 对话框组件
 *
 * 采用的是 html 标准中的 dialog 标签。
 */
export function Dialog(props: DialogProps): JSX.Element {
	let ref!: DialogRef;

	return (
		<dialog
			ref={el => {
				ref = buildRef(el);
				props.ref(ref);
			}}
			class={joinClass(props.palette, styles.dialog, props.class)}
			style={props.style}
		>
			<DialogProvider dialog={ref}>
				{props.header}
				<main class={classList(undefined, { [styles.scrollable]: props.scrollable }, props.mainClass)}>
					{props.children}
				</main>
				{props.footer}
			</DialogProvider>
		</dialog>
	);
}
