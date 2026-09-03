// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flatten, Flattenable, FlattenKeys } from '@cmfx/core';
import { createContext, type JSX, type ParentProps, useContext } from 'solid-js';

import { useForm } from '@cdk/form/form';
import type { FormAttrs, FormField } from '@cdk/form/types';

/**
 * 表单字段的操作接口
 *
 * @typeParam A - 表单字段的属性类型；
 * @typeParam T - 表单对象的类型；
 */
export type FormFieldContext<A extends FormAttrs = FormAttrs, T extends Flattenable = Flattenable> = FormField<
	Flatten<T>[FlattenKeys<T>]
> & {
	/**
	 * 表单字段的名称。
	 */
	readonly name: FlattenKeys<T>;

	/**
	 * 额外的表单字段属性
	 *
	 * @reactive
	 */
	attrs?: A;
};

export type FormFieldProviderProps<A extends FormAttrs = FormAttrs, T extends Flattenable = Flattenable> =
	| {
			readonly isolation?: false;

			/**
			 * 表单字段的名称
			 */
			readonly name: FlattenKeys<T>;

			/**
			 * 额外的表单字段属性
			 *
			 * @reactive
			 */
			attrs?: A;
	  }
	| {
			/**
			 * 隔离一个位于 {@link FormFieldProvider} 之内的组件，使其看起来像是不在 {@link FormFieldProvider} 之内的。
			 */
			readonly isolation: true;
	  };

const formFieldContext = createContext<FormFieldContext | undefined>();

/**
 * 创建一个表单字段的上下文提供器
 */
export function FormFieldProvider<A extends FormAttrs = FormAttrs, T extends Flattenable = Flattenable>(
	props: ParentProps<FormFieldProviderProps<A, T>>,
): JSX.Element {
	if (props.isolation) {
		return <formFieldContext.Provider value={undefined}>{props.children}</formFieldContext.Provider>;
	}

	const form = useForm<FormAttrs, T>();
	const field = form.createField(props.name);
	return (
		<formFieldContext.Provider value={{ ...field, attrs: props.attrs, name: props.name } as FormFieldContext}>
			{props.children}
		</formFieldContext.Provider>
	);
}

/**
 * 获取表单中指定名字的字段操作接口
 */
export function useFormField<A extends FormAttrs = FormAttrs, T extends Flattenable = Flattenable>():
	| FormFieldContext<A, T>
	| undefined {
	return useContext(formFieldContext) as FormFieldContext<A, T>;
}
