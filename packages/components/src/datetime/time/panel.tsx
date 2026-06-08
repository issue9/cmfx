// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, For, type JSX, onMount } from 'solid-js';

import { type BaseProps, type BaseRef, joinClass, type RefProps, type ValueProps } from '@components/base';
import { hoursOptions, minutesOptions } from '@components/datetime/utils';
import { Form } from '@components/form';
import styles from './style.module.css';

export type PanelRef = BaseRef<HTMLFieldSetElement>;

export interface Base extends Omit<Form.DataProps, 'rounded'>, ValueProps<Date>, BaseProps {}

export interface PanelProps extends Base, RefProps<PanelRef> {
	readonly popover?: false;
}

/**
 * 时间选择面板
 */
export function Panel(props: PanelProps): JSX.Element {
	let ref: HTMLFieldSetElement;
	const zero = new Date(0);
	zero.setHours(0, 0, 0, 0);

	const field = Form.useField(props, true);

	const scrollTimer = () => {
		const items = ref.querySelectorAll(`ul>li.${styles.selected}`);
		for (const item of items) {
			const p = item.parentElement!;

			// scrollBy 与 scrollIntoView 不同点在于，scrollBy 并不会让整个 p 出现在页面的可见范围之内。
			const top = item.getBoundingClientRect().top - p.getBoundingClientRect().top;
			p.scrollBy({ top: top, behavior: 'smooth' });
		}
	};

	const val = createMemo(() => {
		return field.getValue() ?? zero;
	});

	field.onChange(() => {
		requestIdleCallback(() => {
			scrollTimer();
		}); // 保证在页面设置完之后，再进行滚动。
	});

	onMount(() => {
		scrollTimer();
	});

	return (
		<fieldset
			disabled={props.disabled}
			popover={props.popover}
			class={joinClass(props.palette, styles.time, props.class)}
			style={props.style}
			ref={el => {
				ref = el;
				if (props.ref) {
					props.ref({
						root: () => el,
					});
				}
			}}
		>
			<ul class={styles.item}>
				<For each={hoursOptions}>
					{item => (
						<li
							classList={{ [styles.selected]: val().getHours() === item[0] }}
							onclick={() => {
								if (props.disabled || props.readonly) {
									return;
								}
								const dt = new Date(val());
								dt.setHours(item[0]);
								field.setValue(dt);
							}}
						>
							{item[1]}
						</li>
					)}
				</For>
			</ul>

			<ul class={styles.item}>
				<For each={minutesOptions}>
					{item => (
						<li
							classList={{ [styles.selected]: val().getMinutes() === item[0] }}
							onclick={() => {
								if (props.disabled || props.readonly) {
									return;
								}
								const dt = new Date(val());
								dt.setMinutes(item[0]);
								field.setValue(dt);
							}}
						>
							{item[1]}
						</li>
					)}
				</For>
			</ul>

			<ul class={styles.item}>
				<For each={minutesOptions}>
					{item => (
						<li
							classList={{ [styles.selected]: val().getSeconds() === item[0] }}
							onclick={() => {
								if (props.disabled || props.readonly) {
									return;
								}
								const dt = new Date(val());
								dt.setSeconds(item[0]);
								field.setValue(dt);
							}}
						>
							{item[1]}
						</li>
					)}
				</For>
			</ul>
		</fieldset>
	);
}
