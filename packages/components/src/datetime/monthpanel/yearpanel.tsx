// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, createSignal, For, type JSX, untrack } from 'solid-js';
import IconPrevYear from '~icons/material-symbols/keyboard-double-arrow-left';
import IconNextYear from '~icons/material-symbols/keyboard-double-arrow-right';
import IconToday from '~icons/material-symbols/today';

import { type BaseProps, joinClass, type RefProps } from '@components/base';
import { Button, ButtonGroup } from '@components/button';
import styles from './style.module.css';

export interface Ref {
	root(): HTMLFieldSetElement;
}

export interface Props extends BaseProps, RefProps<Ref> {
	/**
	 * 禁用状态
	 *
	 * @reactive
	 */
	disabled?: boolean;

	/**
	 * 只读状态
	 *
	 * @reactive
	 */
	readonly?: boolean;

	popover?: boolean | 'manual' | 'auto';

	/**
	 * 关联的值
	 *
	 * @reactive
	 */
	value?: number;

	/**
	 * 最小值
	 *
	 * @reactive
	 */
	min?: number;

	/**
	 * 最大值
	 *
	 * @reactive
	 */
	max?: number;

	/**
	 * 值发生改变时触发的事件
	 */
	onChange?: (val?: number, old?: number) => void;
}

/**
 * 年份选择面板
 */
export function Root(props: Props): JSX.Element {
	const now = new Date();
	const [panelValue, setPanelValue] = createSignal(props.value ?? now.getFullYear());
	const [value, setValue] = createSignal(props.value ?? now.getFullYear());

	createEffect(() => {
		const now = new Date(); // 不复用上一层作用域的 now，可能存在正好跨年的情况。
		setPanelValue(props.value ?? now.getFullYear());
		setValue(props.value ?? now.getFullYear());
	});
	const years = createMemo(() => {
		return genYears(panelValue());
	});

	return (
		<fieldset
			popover={props.popover}
			ref={el => {
				if (props.ref) {
					props.ref({
						root() {
							return el;
						},
					});
				}
			}}
			disabled={props.disabled}
			class={joinClass(props.palette, styles.panel, props.class)}
			style={props.style}
		>
			<header class={styles.year}>
				{years()[0]}-{years()[years().length - 1]}
				<ButtonGroup.Root kind="flat" class={styles.actions}>
					<Button.Root
						square
						onclick={() => {
							setPanelValue(panelValue() - 12);
						}}
						disabled={value() !== undefined && props.min !== undefined && years()[0] - 12 < props.min}
					>
						<IconPrevYear />
					</Button.Root>

					<Button.Root
						square
						onclick={() => {
							setPanelValue(new Date().getFullYear());
						}}
					>
						<IconToday />
					</Button.Root>

					<Button.Root
						square
						onclick={() => {
							setPanelValue(panelValue() - 12);
						}}
						disabled={value() !== undefined && props.max !== undefined && years()[years().length - 1] + 12 > props.max}
					>
						<IconNextYear />
					</Button.Root>
				</ButtonGroup.Root>
			</header>

			<div class={styles.grid}>
				<For each={years()}>
					{year => (
						<Button.Root
							kind="flat"
							checked={value() === year}
							disabled={
								value() !== undefined &&
								((props.min !== undefined && year < props.min) || (props.max !== undefined && year > props.max))
							}
							onclick={() => {
								const old = untrack(value);
								setValue(year);
								if (props.onChange) {
									props.onChange(year, old);
								}
							}}
						>
							{year}
						</Button.Root>
					)}
				</For>
			</div>
		</fieldset>
	);
}

export function genYears(curr: number): Array<number> {
	const start = curr - 4;
	return Array.from({ length: 12 }, (_, i) => start + i);
}
