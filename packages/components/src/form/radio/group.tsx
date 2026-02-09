// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, For, JSX, mergeProps, Show } from 'solid-js';

import { AvailableEnumType, joinClass, Layout } from '@components/base';
import type { Accessor, FieldBaseProps, Options } from '@components/form/field';
import { calcLayoutFieldAreas, Field, FieldHelpArea, fieldArea2Style, useForm } from '@components/form/field';
import { Radio } from './radio';
import styles from './style.module.css';

export interface Props<T extends AvailableEnumType = string> extends FieldBaseProps {
	/**
	 * 是否显示为块
	 *
	 * @reactive
	 */
	block?: boolean;

	/**
	 * 所有 checkbox 项的布局
	 *
	 * @reactive
	 */
	itemLayout?: Layout;

	/**
	 * NOTE: 非响应式属性
	 */
	accessor: Accessor<T>;

	/**
	 * 选择项
	 *
	 * @reactive
	 */
	options: Options<T>;
}

/**
 * 单选框组
 *
 * @remarks 相同名称的单选框组，名称采用 {@link Accessor.name} 值。
 */
export function RadioGroup<T extends AvailableEnumType = string>(props: Props<T>): JSX.Element {
	const form = useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));
	const inputCls = createMemo(() => {
		return joinClass(undefined, styles['group-content'], props.itemLayout === 'vertical' ? 'flex-col' : '');
	});

	const access = props.accessor;
	return (
		<Field
			class={props.class}
			style={props.style}
			title={props.title}
			palette={props.palette}
			ref={el => {
				el.role = 'radiogroup';
			}}
		>
			<Show when={areas().labelArea}>
				{area => (
					<span
						style={{
							...fieldArea2Style(area()),
							width: props.labelWidth,
							'text-align': props.labelAlign,
							cursor: 'default',
						}}
					>
						{props.label}
					</span>
				)}
			</Show>

			{/** biome-ignore lint/a11y/noStaticElementInteractions: 不需要鼠标事件 */}
			<div
				style={fieldArea2Style(areas().inputArea)}
				class={inputCls()}
				onKeyDown={e => {
					if (!props.block || props.disabled || props.readonly) {
						return;
					}

					const index = props.options.findIndex(v => v.value === props.accessor.getValue());

					let newIndex = index;
					if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
						newIndex -= 1;
						if (newIndex < 0) {
							newIndex = props.options.length - 1;
						}
					} else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
						newIndex += 1;
						if (newIndex > props.options.length - 1) {
							newIndex = 0;
						}
					}

					access.setValue(props.options[newIndex].value);
					access.setError();
					e.preventDefault();
				}}
			>
				<For each={props.options}>
					{item => (
						<Radio
							readonly={props.readonly}
							label={item.label}
							block={props.block}
							tabindex={access.getValue() === item.value ? props.tabindex : -1}
							disabled={props.disabled}
							checked={item.value === access.getValue()}
							rounded={props.rounded}
							value={access.getValue()}
							name={props.accessor.name()}
							onChange={() => {
								if (!props.readonly && !props.disabled && access.getValue() !== item.value) {
									access.setValue(item.value);
									access.setError();
								}
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
