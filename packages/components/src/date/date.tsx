// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, type JSX, mergeProps, Show, splitProps } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { type BaseRef, type ChangeFunc, joinClass, type RefProps } from '@components/base';
import { Button } from '@components/button';
import { useLocale } from '@components/context';
import { DatePanel, type Week } from '@components/datetime';
import { Form } from '@components/form';
import styles from './style.module.css';
import { togglePop } from './utils';

export type Ref = BaseRef<HTMLDivElement>;

export interface Props
	extends Form.InputProps,
		Omit<DatePanel.RootProps, 'onChange' | 'value' | 'popover' | 'ref'>,
		RefProps<Ref> {
	placeholder?: string;

	value: Date | undefined;
	onChange: ChangeFunc<Date | undefined>;
}

export function Root(props: Props): JSX.Element {
	const field = Form.useField<Date>() ?? Form.buildFakeFieldContext(props.value);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0, weekBase: 0 as Week }, form, props);

	const l = useLocale();

	const [panelProps, _] = splitProps(props, [
		'time',
		'weekBase',
		'value',
		'onChange',
		'weekend',
		'disabled',
		'readonly',
		'palette',
		'min',
		'max',
	]);

	let panelRef: HTMLElement;
	let anchorRef: HTMLElement;

	const [hover, setHover] = createSignal(false);

	const formater = createMemo(() => {
		return props.time ? l.datetimeFormat().format : l.dateFormat().format;
	});

	return (
		<>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: 正常需要 */}
			<div
				ref={el => (anchorRef = el)}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onclick={() => togglePop(anchorRef, panelRef)}
				class={joinClass(undefined, styles.container, props.rounded ? styles.rounded : '')}
				aria-haspopup
			>
				<input
					id={field.id}
					class={styles.input}
					tabIndex={props.tabindex}
					disabled={props.disabled}
					readOnly
					placeholder={props.placeholder}
					value={formater()(field.getValue())}
				/>
				<Show when={hover() && field.getValue()} fallback={<IconExpandAll />}>
					<IconClose
						onClick={(e: MouseEvent) => {
							e.stopPropagation();
							field.setValue(undefined);
						}}
					/>
				</Show>
			</div>

			<fieldset popover="auto" disabled={props.disabled} ref={el => (panelRef = el)} class={styles.panel} aria-haspopup>
				<DatePanel.Root
					class={styles['dt-panel']}
					{...panelProps}
					value={field.getValue()}
					onChange={val => {
						const old = field.getValue();
						field.setValue(val);
						if (props.onChange) {
							props.onChange(val, old);
						}
					}}
				/>

				<div class={styles.actions}>
					<div class={styles.left}>
						<Button.Root
							kind="flat"
							class="px-1 py-0"
							onclick={() => {
								const now = new Date();
								if ((props.min && props.min > now) || (props.max && props.max < now)) {
									return;
								}
								const old = field.getValue();
								field.setValue(now);
								if (props.onChange) {
									props.onChange(now, old);
								}
								panelRef.hidePopover();
							}}
						>
							{l.t(props.time ? '_c.date.now' : '_c.date.today')}
						</Button.Root>
					</div>

					<div class={styles.right}>
						<Button.Root
							kind="flat"
							class="px-1 py-0"
							onclick={() => {
								const old = field.getValue();
								field.setValue(undefined);
								if (props.onChange) {
									props.onChange(undefined, old);
								}
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
				</div>
			</fieldset>
		</>
	);
}
