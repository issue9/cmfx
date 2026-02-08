// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createUniqueId, JSX, mergeProps, Show, splitProps } from 'solid-js';

import { classList } from '@components/base';
import { ColorPanel, ColorPanelProps } from '@components/color';
import { Dialog, DialogRef } from '@components/dialog';
import type { Accessor, FieldBaseProps } from '@components/form/field';
import { calcLayoutFieldAreas, Field, FieldHelpArea, fieldArea2Style, useForm } from '@components/form/field';
import styles from './style.module.css';

export interface Props extends Omit<ColorPanelProps, 'value' | 'onChange'>, FieldBaseProps {
	accessor: Accessor<string>;
}

export default function ColorPicker(props: Props): JSX.Element {
	const form = useForm();
	props = mergeProps(form, props);

	const [panelProps, _] = splitProps(props, ['palette', 'wcag', 'pickers']);
	let dlgRef: DialogRef;

	const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));
	const id = createUniqueId();
	return (
		<Field class={props.class} title={props.title} palette={props.palette} aria-haspopup style={props.style}>
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

			<div style={fieldArea2Style(areas().inputArea)}>
				<div
					class={classList(undefined, {
						[styles['color-panel-activator']]: true,
						[styles.rounded]: props.rounded,
						[styles.readonly]: props.readonly,
						[styles.disabled]: props.disabled,
					})}
					onclick={() => {
						if (props.disabled) {
							return;
						}

						dlgRef.root().showModal();
					}}
					style={{
						background: props.accessor.getValue(),
						color: props.wcag,
					}}
				>
					<Show when={props.wcag}>A</Show>
					<input
						id={id}
						onClick={e => e.preventDefault()}
						type="color"
						class="hidden"
						disabled={props.disabled}
						readOnly={props.readonly}
					/>
				</div>
			</div>

			<Dialog
				header={props.label}
				movable
				ref={el => {
					dlgRef = el;
				}}
			>
				<ColorPanel {...panelProps} onChange={v => props.accessor.setValue(v)} value={props.accessor.getValue()} />
			</Dialog>

			<Show when={areas().helpArea}>
				{area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
			</Show>
		</Field>
	);
}
