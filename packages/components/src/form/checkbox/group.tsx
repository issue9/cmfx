// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, For, JSX, mergeProps, Show, splitProps } from 'solid-js';

import { AvailableEnumType, joinClass, Layout } from '@components/base';
import {
	Accessor,
	calcLayoutFieldAreas,
	Field,
	FieldBaseProps,
	FieldHelpArea,
	fieldArea2Style,
	Options,
	useForm,
} from '@components/form/field';
import { Checkbox } from './checkbox';
import styles from './style.module.css';

export interface Props<T extends AvailableEnumType = string> extends FieldBaseProps {
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
	accessor: Accessor<Array<T>>;

	/**
	 * 下拉选择项
	 *
	 * @reactive
	 */
	options: Options<T>;
}

export function CheckboxGroup<T extends string | number>(props: Props<T>): JSX.Element {
	const form = useForm();
	props = mergeProps(form, props);

	const [chkProps, _] = splitProps(props, ['disabled', 'readonly', 'tabindex', 'block', 'rounded']);
	const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, !!props.hasHelp, !!props.label));

	const access = props.accessor;
	return (
		<Field class={props.class} title={props.title} palette={props.palette} style={props.style}>
			<Show when={areas().labelArea}>
				{area => (
					<label
						style={{
							...fieldArea2Style(area()),
							width: props.labelWidth,
							'text-align': props.labelAlign,
						}}
					>
						{props.label}
					</label>
				)}
			</Show>

			<div
				style={fieldArea2Style(areas().inputArea)}
				class={joinClass(undefined, styles['group-content'], props.itemLayout === 'vertical' ? 'flex-col' : '')}
			>
				<For each={props.options}>
					{item => (
						<Checkbox
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
				{area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
			</Show>
		</Field>
	);
}
