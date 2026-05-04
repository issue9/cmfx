// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createUniqueId, type JSX, mergeProps, type ParentProps, Show, splitProps } from 'solid-js';

import { type BaseRef, classList, type RefProps } from '@components/base';
import { ColorPanel } from '@components/color';
import { useLocale } from '@components/context';
import { Dialog } from '@components/dialog';
import { Form1 } from '@components/form1/form';
import styles from './style.module.css';

export interface Ref extends BaseRef<HTMLDivElement> {
	showPicker(): void;
}

export interface Props
	extends Omit<ColorPanel.RootProps, 'value' | 'onChange' | 'ref'>,
		Form1.FieldBaseProps,
		ParentProps,
		RefProps<Ref> {
	accessor: Form1.Accessor<string | undefined>;

	/**
	 * 作用在显示元素上的样式
	 *
	 * @reactive
	 */
	activatorClass?: string;
}

export function Root(props: Props): JSX.Element {
	const l = useLocale();
	const form = Form1.useForm();
	props = mergeProps(form, props);

	const [panelProps, _] = splitProps(props, ['palette', 'wcag', 'pickers']);
	let dlgRef: Dialog.RootRef;

	const areas = createMemo(() => Form1.calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));
	const id = createUniqueId();
	return (
		<Form1.Field
			class={props.class}
			title={props.title}
			palette={props.palette}
			aria-haspopup
			style={props.style}
			ref={el => {
				if (props.ref) {
					props.ref({
						root: () => el,
						showPicker: () => {
							dlgRef?.root().showModal();
						},
					});
				}
			}}
		>
			<Show when={areas().labelArea}>
				{area => (
					<label
						style={{
							...Form1.fieldArea2Style(area()),
							width: props.labelWidth,
							'text-align': props.labelAlign,
						}}
						for={id}
					>
						{props.label}
					</label>
				)}
			</Show>

			<div style={Form1.fieldArea2Style(areas().inputArea)}>
				<div
					class={classList(
						undefined,
						{
							[styles.activator]: true,
							[styles.rounded]: props.rounded,
							[styles.readonly]: props.readonly,
							[styles.disabled]: props.disabled,
						},
						props.activatorClass,
					)}
					onclick={() => dlgRef.root().showModal()}
					style={{
						color: props.accessor.getValue(),
						background: props.wcag,
					}}
				>
					{props.children ?? props.accessor.getValue()}
				</div>
			</div>

			<Dialog.Root
				ref={el => (dlgRef = el)}
				header={
					<Dialog.Toolbar close movable>
						{l.t('_c.color.pickColor')}
					</Dialog.Toolbar>
				}
			>
				<ColorPanel.Root {...panelProps} onChange={v => props.accessor.setValue(v)} value={props.accessor.getValue()} />
			</Dialog.Root>

			<Show when={areas().helpArea}>
				{area => <Form1.FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
			</Show>
		</Form1.Field>
	);
}
