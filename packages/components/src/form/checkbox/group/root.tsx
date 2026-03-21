// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, For, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { type AvailableEnumType, type BaseRef, joinClass, type Layout, type RefProps } from '@components/base';
import { Checkbox } from '@components/form/checkbox/checkbox';
import { Form } from '@components/form/form';
import styles from './style.module.css';

export type Ref = BaseRef<HTMLDivElement>;

export interface Props<T extends AvailableEnumType = string> extends Form.FieldBaseProps, RefProps<Ref> {
	/**
	 * 是否显示为块
	 *
	 * @reactive
	 */
	block?: boolean;

	/**
	 * 子项的布局方式
	 *
	 * @reactive
	 */
	itemLayout?: Layout;

	/**
	 * NOTE: 非响应式属性
	 */
	accessor: Form.Accessor<Array<T>>;

	/**
	 * 下拉选择项
	 *
	 * @reactive
	 */
	options: Form.FieldOptions<T>;
}

export function Root<T extends string | number>(props: Props<T>): JSX.Element {
	const form = Form.useForm();
	props = mergeProps(form, props);

	const [chkProps, _] = splitProps(props, ['disabled', 'readonly', 'tabindex', 'block', 'rounded']);
	const areas = createMemo(() => Form.calcLayoutFieldAreas(props.layout!, !!props.hasHelp, !!props.label));

	const access = props.accessor;
	return (
		<Form.Field
			class={props.class}
			title={props.title}
			palette={props.palette}
			style={props.style}
			ref={el => {
				if (props.ref) {
					props.ref({ root: () => el });
				}
			}}
		>
			<Show when={areas().labelArea}>
				{area => (
					<div
						style={{
							...Form.fieldArea2Style(area()),
							width: props.labelWidth,
							'text-align': props.labelAlign,
						}}
					>
						{props.label}
					</div>
				)}
			</Show>

			<div
				style={Form.fieldArea2Style(areas().inputArea)}
				class={joinClass(undefined, styles['group-content'], props.itemLayout === 'vertical' ? 'flex-col' : '')}
			>
				<For each={props.options}>
					{item => (
						<Checkbox.Root
							{...chkProps}
							label={item.label}
							rounded={props.rounded}
							checked={!!access.getValue().find(v => v === item.value)}
							onChange={v => {
								if (v) {
									access.setValue([...access.getValue(), item.value]);
								} else {
									access.setValue(access.getValue().filter(v => v !== item.value));
								}
								access.setError();
							}}
						/>
					)}
				</For>
			</div>

			<Show when={areas().helpArea}>
				{area => <Form.FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
			</Show>
		</Form.Field>
	);
}
