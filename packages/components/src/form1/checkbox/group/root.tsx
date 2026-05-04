// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, For, type JSX, mergeProps, splitProps } from 'solid-js';

import type { AvailableEnumType, BaseRef, ChangeFunc, Layout, RefProps } from '@components/base';
import { joinClass } from '@components/base';
import { Form } from '@components/form';
import { Checkbox } from '@components/form1/checkbox/checkbox';
import type { Form1 } from '@components/form1/form';
import styles from './style.module.css';

export type Ref = BaseRef<HTMLDivElement>;

export interface Props<T extends AvailableEnumType = string> extends Form1.FieldBaseProps, RefProps<Ref> {
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
	options: Form1.FieldOptions<T>;
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
						rounded={props.rounded}
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
