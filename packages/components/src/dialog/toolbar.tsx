// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { movable } from '@cmfx/core';
import type { JSX, ParentProps } from 'solid-js';
import { createSignal, onCleanup, onMount, Show } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconMinimize from '~icons/material-symbols/minimize-rounded';

import type { BaseProps } from '@components/base';
import { Button, ToggleButton } from '@components/button';
import { useLocale } from '@components/context';
import { CancelButton } from './buttons';
import { useDialog } from './context';
import styles from './style.module.css';

/**
 * 对话框的状态
 */
export type State = 'minimize' | 'maximize' | 'preset';

export interface ToolbarProps extends BaseProps, ParentProps {
	/**
	 * 初始的对话框状态
	 *
	 * @defaultValue 'preset'
	 */
	initState?: State;

	/**
	 * 整个窗口为可移动
	 *
	 * @reactive
	 */
	movable?: boolean;

	/**
	 * 是否显示最小化按钮
	 *
	 * @reactive
	 */
	min?: boolean;

	/**
	 * 是否显示最大化按钮
	 *
	 * @reactive
	 */
	max?: boolean;

	/**
	 * 是否显示关闭按钮
	 *
	 * @reactive
	 */
	close?: boolean;
}

export function Toolbar(props: ToolbarProps): JSX.Element {
	let toolbarRef: HTMLElement;
	const ctx = useDialog();
	const l = useLocale();
	const [state, setState] = createSignal(props.initState ?? 'preset');

	onMount(() => {
		const cancelMovable = props.movable ? movable(toolbarRef, ctx.dialog.root()) : undefined;
		if (cancelMovable) {
			onCleanup(() => cancelMovable());
		}
	});

	let h: number;
	onMount(() => {
		// 只在 mount 之后，获取的高度才是正确的
		ctx.dialog.root().addEventListener('toggle', () => {
			if (ctx.dialog.root().open && !h) {
				h = ctx.dialog.root().offsetHeight;
			}
		});
	});

	// 保存在最大化之前的状态，用来恢复时能正确还原状态。
	let prevState: State = state();

	return (
		<header ref={el => (toolbarRef = el)}>
			{props.children}
			<div class={styles.control}>
				<Show when={props.min && state() !== 'maximize'}>
					<Button.Root
						square
						onclick={() => {
							const dlg = ctx.dialog.root();
							setState(state() === 'preset' ? 'minimize' : 'preset');
							dlg.style.height = `${state() === 'minimize' ? toolbarRef.offsetHeight : h}px`;
						}}
					>
						<IconMinimize />
					</Button.Root>
				</Show>

				<Show when={props.max}>
					<ToggleButton.FitScreen
						square
						container={ctx.dialog.root()}
						onToggle={async v => {
							if (v) {
								prevState = state();
								setState('maximize');
							} else {
								setState(prevState);
							}

							return undefined;
						}}
					/>
				</Show>

				<Show when={props.close}>
					<CancelButton palette="error" square ref={el => (el.root().ariaLabel = l.t('_c.close'))}>
						<IconClose />
					</CancelButton>
				</Show>
			</div>
		</header>
	);
}
