// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, createUniqueId, type JSX, mergeProps, Show, splitProps, untrack } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { type BaseRef, joinClass, type RefProps } from '@components/base';
import { type Week, WeekPanel } from '@components/datetime';
import type { WeekValueType } from '@components/datetime/dateview';
import type { Accessor } from '@components/form/field';
import { calcLayoutFieldAreas, Field, FieldHelpArea, fieldArea2Style, useForm } from '@components/form/field';
import type { Props as PickerProps } from './date';
import styles from './style.module.css';
import { togglePop } from './utils';

export type Ref = BaseRef<HTMLDivElement>;

export interface Props extends Omit<PickerProps, 'accessor' | 'accentPalette' | 'time' | 'ref'>, RefProps<Ref> {
	accessor: Accessor<WeekValueType | undefined>;
}

/**
 * 周数选择组件
 */
export function Root(props: Props): JSX.Element {
	const form = useForm();
	props = mergeProps({ weekBase: 0 as Week }, form, props);

	const [panelProps, _] = splitProps(props, ['weekBase', 'weekend', 'disabled', 'readonly', 'palette', 'min', 'max']);

	let panelRef: HTMLElement;
	let anchorRef: HTMLElement;

	const [hover, setHover] = createSignal(false);

	const change = (val?: WeekValueType) => {
		props.accessor.setValue(val);
		panelRef.hidePopover();
	};

	const format = (val: WeekValueType) => {
		return val ? `${val[0]}-${val[1]}` : '';
	};

	const id = createUniqueId();
	const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));
	return (
		<Field
			class={joinClass(undefined, styles.activator, props.class)}
			style={props.style}
			title={props.title}
			palette={props.palette}
			ref={el => {
				if (props.ref) {
					props.ref({ root: () => el });
				}
			}}
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
				class={joinClass(undefined, styles.container, props.rounded ? styles.rounded : undefined)}
			>
				<input
					id={id}
					readOnly
					disabled={props.disabled}
					placeholder={props.placeholder}
					class={joinClass(undefined, styles.input, styles.range)}
					value={format(props.accessor.getValue()!)}
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

			<WeekPanel.Root
				{...panelProps}
				ref={el => {
					panelRef = el.root();
				}}
				popover="auto"
				disabled={props.disabled}
				aria-haspopup
				value={untrack(props.accessor.getValue)}
				onChange={change}
			/>

			<Show when={areas().helpArea}>
				{area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
			</Show>
		</Field>
	);
}
