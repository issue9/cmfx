// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { movable } from '@cmfx/core';
import { type JSX, onCleanup, onMount, type ParentProps, Show } from 'solid-js';
import IconClose from '~icons/material-symbols/close';

import { type BaseProps, joinClass, PropsError } from '@components/base';
import { useLocale } from '@components/context';
import { CancelButton } from './buttons';
import type { Ref } from './context';
import { DialogProvider } from './context';
import styles from './style.module.css';

export interface Props extends BaseProps, ParentProps {
	// https://caniuse.com/?search=closedby
	// closedby

	ref: (m: Ref) => void;

	/**
	 * 指定标题内容
	 *
	 * @remarrks
	 * 如果此值不为空则同时会显示关闭按钮。如果想要 {@link movable} 有效果，此值不能为空。
	 */
	header?: JSX.Element;

	/**
	 * 底部的按钮
	 *
	 * @reactive
	 */
	footer?: JSX.Element;

	/**
	 * 是否是可拖拽移动的
	 */
	movable?: boolean;

	/**
	 * 内容是否可滚动
	 *
	 * @reactive
	 */
	scrollable?: boolean;
}

function buildRef(ref: HTMLDialogElement): Ref {
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
export function Root(props: Props): JSX.Element {
	if (props.movable && !props.header) {
		throw new PropsError('header', 'header must be provided when movable is true');
	}

	const l = useLocale();

	let rootRef: HTMLDialogElement;
	let toolbarRef: HTMLElement;

	let ref!: Ref;

	onMount(() => {
		const cancelMovable = props.movable ? movable(toolbarRef, rootRef) : undefined;
		if (cancelMovable) {
			onCleanup(() => cancelMovable());
		}
	});

	return (
		<dialog
			ref={el => {
				ref = buildRef(el);
				props.ref(ref);
				rootRef = el;
			}}
			class={joinClass(props.palette, styles.dialog, props.class)}
			style={props.style}
		>
			<DialogProvider dialog={ref}>
				<Show when={props.header}>
					{c => (
						<header
							ref={el => {
								toolbarRef = el;
							}}
						>
							{c()}
							<CancelButton
								palette={props.palette}
								square
								class={styles.close}
								ref={el => (el.root().ariaLabel = l.t('_c.close'))}
							>
								<IconClose />
							</CancelButton>
						</header>
					)}
				</Show>

				<main class={props.scrollable ? styles.scrollable : ''}>{props.children}</main>

				<Show when={props.footer}>{c => <footer>{c()}</footer>}</Show>
			</DialogProvider>
		</dialog>
	);
}
