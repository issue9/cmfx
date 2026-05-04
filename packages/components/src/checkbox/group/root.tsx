// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, For, type JSX, mergeProps, splitProps } from 'solid-js';

import type { AvailableEnumType, BaseProps, BaseRef, ChangeFunc, Layout, RefProps } from '@components/base';
import { joinClass } from '@components/base';
import { Checkbox } from '@components/checkbox/checkbox';
import { Form } from '@components/form';
import type { Options } from './options';
import styles from './style.module.css';

export type Ref = BaseRef<HTMLDivElement>;

export interface Props<T extends AvailableEnumType = string> extends BaseProps, RefProps<Ref> {
	/**
	 * 禁用组件
	 *
	 * @reactive
	 */
	disabled?: boolean;

	/**
	 * 只读属性
	 *
	 * @reactive
	 */
	readonly?: boolean;

	/**
	 * 表单组件的 layout 属性的默认值
	 *
	 * @remarks 同时也影响整个 Form 组件的布局。
	 * @reactive
	 * @defaultValue 'horizontal'
	 */
	layout?: Layout;

	/**
	 * 表单组件的 rounded 属性的默认值
	 *
	 * @reactive
	 */
	rounded?: boolean;

	/**
	 * 表单组件中 label 宽度的默认值
	 *
	 * @reactive
	 */
	labelWidth?: string;

	/**
	 * 表单组件中 label 的对齐方式
	 *
	 * @remarks
	 * 只有在 label 有明确宽度的情况下该属性才有效，比如设置了一个比较宽的 {@link labelWidth}。
	 *
	 * @reactive
	 * @defaultValue layout === 'horizontal' ? 'end' : 'start'
	 */
	labelAlign?: Form.LabelAlignment;

	tabindex?: number;

	label?: JSX.Element;

	/**
	 * 提示信息
	 */
	help?: JSX.Element;

	/**
	 * 值
	 *
	 * @reactive
	 */
	value?: Array<T>;

	onChange?: ChangeFunc<Array<T>>;

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
	 * 下拉选择项
	 *
	 * @reactive
	 */
	options: Options<T>;
}

export function Root<T extends string | number>(props: Props<T>): JSX.Element {
	const form = Form.useForm();
	props = mergeProps(form, props);
	const field = Form.useField<Array<T>>() ?? Form.buildFakeFieldContext(props.value);

	const [chkProps, _] = splitProps(props, ['disabled', 'readonly', 'tabindex', 'block', 'rounded']);

	const cls = createMemo(() => {
		return joinClass(
			props.palette,
			styles['group-content'],
			props.class,
			props.itemLayout === 'vertical' ? 'flex-col' : '',
		);
	});

	return (
		<div
			class={cls()}
			style={props.style}
			ref={el => {
				if (props.ref) {
					props.ref({ root: () => el });
				}
			}}
		>
			<For each={props.options}>
				{item => (
					<Checkbox.Root
						{...chkProps}
						label={item.label}
						tabindex={field.tabindex()}
						checked={!!field.getValue()?.find(v => v === item.value)}
						onChange={v => {
							const oldVal = field.getValue();
							const old = oldVal ?? [];

							const vals = v ? [...old, item.value] : old.filter(v => v !== item.value);

							field.setValue(vals);
							if (props.onChange) props.onChange(vals, old);
						}}
					/>
				)}
			</For>
		</div>
	);
}
