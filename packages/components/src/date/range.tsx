// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, type JSX, mergeProps, Show, splitProps } from 'solid-js';
import IconArrowRight from '~icons/bxs/right-arrow';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { type BaseRef, joinClass, type RefProps } from '@components/base';
import { Button } from '@components/button';
import { useLocale } from '@components/context';
import { type DatePanel, DateRangePanel, type Week } from '@components/datetime';
import { Form } from '@components/form';
import styles from './style.module.css';
import { togglePop } from './utils';

export type Ref = BaseRef<HTMLDivElement>;

export interface Props
	extends Form.DataProps<DateRangePanel.ValueType>,
		Omit<DatePanel.RootProps, 'onChange' | 'value' | 'popover' | 'ref'>,
		RefProps<Ref> {
	placeholder?: string;

	/**
	 * 中间的箭头
	 *
	 * @reactive
	 */
	arrowIcon?: JSX.Element;

	/**
	 * 是否显示右侧快捷选择栏
	 *
	 * @reactive
	 */
	shortcuts?: boolean;
}

export function Root(props: Props): JSX.Element {
	const field = Form.useField<DateRangePanel.ValueType>(props, true);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0, weekBase: 0 as Week, arrowIcon: <IconArrowRight /> }, form, props);

	const l = useLocale();

	const [panelProps, _] = splitProps(props, [
		'time',
		'weekBase',
		'weekend',
		'disabled',
		'readonly',
		'palette',
		'min',
		'max',
		'shortcuts',
	]);

	let panelRef: HTMLElement;
	let anchorRef: HTMLElement;

	const [hover, setHover] = createSignal(false);

	const formater = createMemo(() => {
		return props.time ? l.datetimeFormat().format : l.dateFormat().format;
	});

	return (
		<>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: 正常需求 */}
			<div
				ref={el => (anchorRef = el)}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onclick={() => togglePop(anchorRef, panelRef)}
				class={joinClass(undefined, styles.container, props.rounded ? styles.rounded : undefined)}
				aria-haspopup
			>
				<input
					id={field.id()}
					readOnly
					disabled={props.disabled}
					placeholder={props.placeholder}
					class={joinClass(undefined, styles.input, styles.range)}
					value={formater()(field.getValue()?.[0])}
				/>
				<div class="shrink-0 px-1">{props.arrowIcon}</div>
				<input
					readOnly
					disabled={props.disabled}
					placeholder={props.placeholder}
					class={joinClass(undefined, styles.input, styles.range)}
					value={formater()(field.getValue()?.[1])}
				/>

				<Show when={hover() && field.getValue()} fallback={<IconExpandAll class="shrink-0" />}>
					<IconClose
						class="shrink-0"
						onClick={(e: MouseEvent) => {
							e.stopPropagation();
							field.setValue(undefined);
						}}
					/>
				</Show>
			</div>

			<fieldset popover="auto" disabled={props.disabled} ref={el => (panelRef = el)} class={styles.panel} aria-haspopup>
				<DateRangePanel.Root
					class={styles['dt-panel']}
					{...panelProps}
					value={field.getValue()}
					onChange={v => field.setValue(v)}
				/>

				<div class={joinClass(undefined, styles.actions, 'justify-end!')}>
					<Button.Root
						kind="flat"
						class="px-1 py-0"
						onclick={() => {
							field.setValue([undefined, undefined]);
							panelRef.hidePopover();
						}}
					>
						{l.t('_c.date.clear')}
					</Button.Root>

					<Button.Root
						kind="flat"
						class="px-1 py-0"
						onclick={() => {
							field.reset();
							panelRef.hidePopover();
						}}
					>
						{l.t('_c.reset')}
					</Button.Root>
				</div>
			</fieldset>
		</>
	);
}
