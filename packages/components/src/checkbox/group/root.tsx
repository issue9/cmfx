// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, For, type JSX, mergeProps, splitProps } from 'solid-js';

import type { AvailableEnumType, BaseProps, BaseRef, Layout, RefProps } from '@components/base';
import { joinClass } from '@components/base';
import { Checkbox } from '@components/checkbox/checkbox';
import { Form } from '@components/form';
import type { Options } from './options';
import styles from './style.module.css';

export type Ref = BaseRef<HTMLDivElement>;

export interface Props<T extends AvailableEnumType = string>
	extends BaseProps,
		Form.DataProps<Array<T>>,
		RefProps<Ref> {
	/**
	 * 子项的布局方式
	 *
	 * @reactive
	 * @defaultValue 'horizontal'
	 */
	layout?: Layout;

	/**
	 * 是否显示为块
	 *
	 * @reactive
	 */
	block?: boolean;

	/**
	 * 下拉选择项
	 *
	 * @reactive
	 */
	options: Options<T>;
}

export function Root<T extends string | number>(props: Props<T>): JSX.Element {
	const field = Form.useField<Array<T>>(props, true);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);
	const [chkProps, _] = splitProps(props, ['disabled', 'readonly', 'tabindex', 'block', 'rounded']);

	createEffect(() => {
		if (props.value !== undefined) {
			field.setValue(props.value);
		}
	});

	const cls = createMemo(() => {
		return joinClass(
			props.palette,
			styles['group-content'],
			props.class,
			props.layout === 'vertical' ? 'flex-col' : '',
		);
	});

	const vals = createMemo(() => field.getValue() ?? []);

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
						checked={!!vals().find(v => v === item.value)}
						onChange={v => {
							const old = vals();
							const values = v ? [...old, item.value] : old.filter(v => v !== item.value);
							field.setValue(values);
						}}
					/>
				)}
			</For>
		</div>
	);
}
