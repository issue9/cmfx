// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, createUniqueId, JSX, mergeProps, Show, splitProps } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { joinClass } from '@components/base';
import { Button } from '@components/button';
import { useLocale } from '@components/context';
import { DatePanel, DatePanelProps, Week } from '@components/datetime';
import type { Accessor, FieldBaseProps } from '@components/form/field';
import { calcLayoutFieldAreas, Field, FieldHelpArea, fieldArea2Style, useForm } from '@components/form/field';
import styles from './style.module.css';
import { togglePop } from './utils';

// 允许的日期类型
export type DateType = Date | string | number;

export interface Props<T extends DateType>
	extends FieldBaseProps,
		Omit<DatePanelProps, 'onChange' | 'value' | 'popover' | 'ref'> {
	placeholder?: string;

	/**
	 * NOTE: 非响应式属性
	 */
	accessor: Accessor<T | undefined, 'number' | 'string' | 'date'>;
}

export function DatePicker<T extends DateType>(props: Props<T>): JSX.Element {
	const form = useForm();
	props = mergeProps({ weekBase: 0 as Week }, form, props);

	const l = useLocale();

	const [panelProps, _] = splitProps(props, [
		'time',
		'weekBase',
		'accessor',
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

	const getValue = (): Date | undefined => {
		const v = props.accessor.getValue();
		if (v === undefined) {
			return v;
		}

		switch (props.accessor.kind()) {
			case 'string':
			case 'number':
				return new Date(v);
			default:
				return v as Date;
		}
	};

	const setValue = (value?: Date) => {
		switch (props.accessor.kind()) {
			case 'string':
				props.accessor.setValue(value?.toISOString() as any);
				break;
			case 'number':
				props.accessor.setValue(value?.getTime() as any);
				break;
			default:
				props.accessor.setValue(value as any);
				break;
		}
	};

	const id = createUniqueId();
	const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));
	return (
		<Field
			palette={props.palette}
			class={joinClass(undefined, styles.activator, props.class)}
			style={props.style}
			title={props.title}
			aria-haspopup
		>
			<Show when={areas().labelArea}>
				{area => (
					<label
						style={{
							...fieldArea2Style(area()),
							width: props.labelWidth,
							'text-align': props.labelAlign,
						}}
						for={id}
					>
						{props.label}
					</label>
				)}
			</Show>

			<div
				style={fieldArea2Style(areas().inputArea)}
				ref={el => (anchorRef = el)}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onclick={() => togglePop(anchorRef, panelRef)}
				class={joinClass(undefined, styles['activator-container'], props.rounded ? styles.rounded : '')}
			>
				<input
					id={id}
					class={styles.input}
					tabIndex={props.tabindex}
					disabled={props.disabled}
					readOnly
					placeholder={props.placeholder}
					value={props.accessor.getValue() ? formater()(getValue()) : ''}
				/>
				<Show when={hover() && props.accessor.getValue()} fallback={<IconExpandAll />}>
					<IconClose
						onClick={(e: MouseEvent) => {
							e.stopPropagation();
							props.accessor.setValue(undefined);
						}}
					/>
				</Show>
			</div>

			<fieldset
				popover="auto"
				disabled={props.disabled}
				ref={el => {
					panelRef = el;
				}}
				class={styles.panel}
				aria-haspopup
			>
				<DatePanel class={styles['dt-panel']} {...panelProps} value={getValue()} onChange={val => setValue(val)} />

				<div class={styles.actions}>
					<div class={styles.left}>
						<Button
							kind="flat"
							class="px-1 py-0"
							onclick={() => {
								const now = new Date();
								if ((props.min && props.min > now) || (props.max && props.max < now)) {
									return;
								}
								props.accessor.setValue(now as any);
								panelRef.hidePopover();
							}}
						>
							{l.t(props.time ? '_c.date.now' : '_c.date.today')}
						</Button>
					</div>

					<div class={styles.right}>
						<Button
							kind="flat"
							class="px-1 py-0"
							onclick={() => {
								props.accessor.setValue(undefined);
								panelRef.hidePopover();
							}}
						>
							{l.t('_c.date.clear')}
						</Button>

						<Button
							kind="flat"
							class="px-1 py-0"
							onclick={() => {
								props.accessor.reset();
								panelRef.hidePopover();
							}}
						>
							{l.t('_c.reset')}
						</Button>
					</div>
				</div>
			</fieldset>

			<Show when={areas().helpArea}>
				{area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
			</Show>
		</Field>
	);
}
