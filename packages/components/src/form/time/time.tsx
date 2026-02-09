// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { createMemo, createSignal, createUniqueId, JSX, mergeProps, Show, untrack } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { joinClass } from '@components/base';
import { useLocale } from '@components/context';
import { TimePanel, TimePanelProps, TimePanelRef } from '@components/datetime/timepanel';
import type { Accessor, FieldBaseProps } from '@components/form/field';
import { calcLayoutFieldAreas, Field, FieldHelpArea, fieldArea2Style, useForm } from '@components/form/field';
import styles from './style.module.css';

export interface Props extends FieldBaseProps, Omit<TimePanelProps, 'onChange' | 'value' | 'popover' | 'ref'> {
	placeholder?: string;

	/**
	 * NOTE: 非响应式属性
	 */
	accessor: Accessor<Date | undefined>;
}

function togglePop(anchor: Element, popElem: HTMLElement): boolean {
	const ab = anchor.getBoundingClientRect();
	const ret = popElem.togglePopover();
	adjustPopoverPosition(popElem, ab, 2);
	return ret;
}

export default function Time(props: Props): JSX.Element {
	const form = useForm();
	props = mergeProps(form, props);
	const l = useLocale();

	const ac = props.accessor;
	const [hover, setHover] = createSignal(false);

	let panelRef: TimePanelRef;
	let anchorRef: HTMLElement;

	const id = createUniqueId();
	const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));

	const formatter = createMemo(
		() =>
			new Intl.DateTimeFormat(l.locale, {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			}),
	);

	return (
		<Field
			class={joinClass(undefined, styles.activator, props.class)}
			style={props.style}
			title={props.title}
			palette={props.palette}
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

			{/** biome-ignore lint/a11y/noStaticElementInteractions: Mouse 事件上是为了达到 label 效果 */}
			<div
				style={fieldArea2Style(areas().inputArea)}
				ref={el => {
					anchorRef = el;
				}}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onclick={() => togglePop(anchorRef, panelRef.root())}
				class={joinClass(undefined, styles['activator-container'], props.rounded ? styles.rounded : '')}
			>
				<input
					id={id}
					class={styles.input}
					tabIndex={props.tabindex}
					disabled={props.disabled}
					readOnly
					placeholder={props.placeholder}
					value={ac.getValue() ? formatter().format(ac.getValue()) : ''}
				/>
				<Show when={hover() && ac.getValue()} fallback={<IconExpandAll />}>
					<IconClose
						onClick={(e: MouseEvent) => {
							e.stopPropagation();
							ac.setValue(undefined);
						}}
					/>
				</Show>
			</div>

			<TimePanel
				popover="auto"
				ref={el => {
					panelRef = el;
				}}
				disabled={props.disabled}
				readonly={props.readonly}
				value={ac.getValue()}
				onChange={val => {
					if (untrack(ac.getValue) === val) {
						return;
					}
					ac.setValue(val);
				}}
			/>

			<Show when={areas().helpArea}>
				{area => <FieldHelpArea area={area()} getError={ac.getError} help={props.help} />}
			</Show>
		</Field>
	);
}
