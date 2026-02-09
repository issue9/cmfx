// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, createUniqueId, JSX, mergeProps, Show, splitProps, untrack } from 'solid-js';
import IconArrowRight from '~icons/bxs/right-arrow';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { joinClass } from '@components/base';
import { Button } from '@components/button';
import { useLocale } from '@components/context';
import { DateRangePanel, DateRangeValueType, Week } from '@components/datetime';
import type { Accessor } from '@components/form/field';
import {
	calcLayoutFieldAreas,
	Field,
	FieldHelpArea,
	fieldAccessor,
	fieldArea2Style,
	useForm,
} from '@components/form/field';
import { Props as PickerProps } from './date';
import styles from './style.module.css';
import { togglePop } from './utils';

interface Base extends Omit<PickerProps, 'accessor'> {
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

interface DateProps extends Base {
	accessor: Accessor<DateRangeValueType | undefined, 'date'>;
}

interface NumberProps extends Base {
	accessor: Accessor<[start: number | undefined, end: number | undefined] | undefined, 'number'>;
}

interface StringProps extends Base {
	accessor: Accessor<[start: string | undefined, end: string | undefined] | undefined, 'string'>;
}

export type Props = DateProps | NumberProps | StringProps;

function isDateProps(props: Props): props is DateProps {
	return props.accessor.kind() === 'date';
}

function isStringProps(props: Props): props is StringProps {
	return props.accessor.kind() === 'string';
}

function isNumberProps(props: Props): props is NumberProps {
	return props.accessor.kind() === 'number';
}

export default function Picker(props: Props): JSX.Element {
	if (isDateProps(props)) {
		return <DateRangePicker {...props} />;
	} else if (isNumberProps(props)) {
		const val = props.accessor.getValue();
		const rng: DateRangeValueType | undefined = val
			? [val[0] ? new Date(val[0]) : undefined, val[1] ? new Date(val[1]) : undefined]
			: undefined;
		const accessor = fieldAccessor('accessor', rng, 'date');
		accessor.onChange(v => props.accessor.setValue(v ? [v[0]?.getTime(), v[1]?.getTime()] : undefined));
		const [_, p] = splitProps(props, ['accessor']);
		return <DateRangePicker {...p} accessor={accessor} />;
	} else if (isStringProps(props)) {
		const val = props.accessor.getValue();
		const rng: DateRangeValueType | undefined = val
			? [val[0] ? new Date(val[0]) : undefined, val[1] ? new Date(val[1]) : undefined]
			: undefined;
		const accessor = fieldAccessor('accessor', rng, 'date');
		accessor.onChange(v => props.accessor.setValue(v ? [v[0]?.toISOString(), v[1]?.toISOString()] : undefined));
		const [_, p] = splitProps(props, ['accessor']);
		return <DateRangePicker {...p} accessor={accessor} />;
	}
}

function DateRangePicker(props: DateProps): JSX.Element {
	const form = useForm();
	props = mergeProps(
		{
			weekBase: 0 as Week,
			arrowIcon: <IconArrowRight />,
		},
		form,
		props,
	);
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

			{/** biome-ignore lint/a11y/noStaticElementInteractions: 正常需求 */}
			<div
				style={fieldArea2Style(areas().inputArea)}
				ref={el => {
					anchorRef = el;
				}}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onclick={() => togglePop(anchorRef, panelRef)}
				class={joinClass(undefined, styles['activator-container'], props.rounded ? styles.rounded : undefined)}
			>
				<input
					id={id}
					readOnly
					disabled={props.disabled}
					placeholder={props.placeholder}
					class={joinClass(undefined, styles.input, styles.range)}
					value={formater()(props.accessor.getValue()?.[0])}
				/>
				<div class="shrink-0 px-1">{props.arrowIcon}</div>
				<input
					readOnly
					disabled={props.disabled}
					placeholder={props.placeholder}
					class={joinClass(undefined, styles.input, styles.range)}
					value={formater()(props.accessor.getValue()?.[1])}
				/>

				<Show when={hover() && props.accessor.getValue()} fallback={<IconExpandAll class="shrink-0" />}>
					<IconClose
						class="shrink-0"
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
				<DateRangePanel
					class={styles['dt-panel']}
					{...panelProps}
					value={untrack(props.accessor.getValue)}
					onChange={v => {
						props.accessor.setValue(v);
					}}
				/>

				<div class={joinClass(undefined, styles.actions, 'justify-end!')}>
					<Button
						kind="flat"
						class="px-1 py-0"
						onclick={() => {
							props.accessor.setValue([undefined, undefined]);
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
			</fieldset>

			<Show when={areas().helpArea}>
				{area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
			</Show>
		</Field>
	);
}
