// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createUniqueId, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { classList, type RefProps } from '@components/base';
import { ColorPanel } from '@components/color';
import { Dialog } from '@components/dialog';
import type { Accessor, FieldBaseProps } from '@components/form/field';
import { calcLayoutFieldAreas, Field, FieldHelpArea, fieldArea2Style, useForm } from '@components/form/field';
import styles from './style.module.css';

export interface Ref {
	root(): HTMLDivElement;
}

export interface Props extends Omit<ColorPanel.RootProps, 'value' | 'onChange' | 'ref'>, FieldBaseProps, RefProps<Ref> {
	accessor: Accessor<string>;
}

export function Root(props: Props): JSX.Element {
	const form = useForm();
	props = mergeProps(form, props);

	const [panelProps, _] = splitProps(props, ['palette', 'wcag', 'pickers']);
	let dlgRef: Dialog.RootRef;

	const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));
	const id = createUniqueId();
	return (
		<Field
			class={props.class}
			title={props.title}
			palette={props.palette}
			aria-haspopup
			style={props.style}
			ref={el => {
				if (props.ref) {
					props.ref({ root: () => el });
				}
			}}
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

			<Dialog.Root
				header={props.label}
				movable
				ref={el => {
					dlgRef = el;
				}}
			>
				<ColorPanel.Root {...panelProps} onChange={v => props.accessor.setValue(v)} value={props.accessor.getValue()} />
			</Dialog.Root>

			<Show when={areas().helpArea}>
				{area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
			</Show>
		</Field>
	);
}
