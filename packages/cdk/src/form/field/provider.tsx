// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Converter, Flatten, Flattenable, FlattenKeys } from '@cmfx/core';
import { createContext, type JSX, type ParentProps, useContext } from 'solid-js';

import type { ChangeFunc } from '@cdk/base';
import { useForm } from '@cdk/form/form';
import type { FormAttrs, FormField } from '@cdk/form/types';

/**
 * 表单字段的操作接口
 *
 * @typeParam A - 表单字段的属性类型；
 * @typeParam T - 表单对象的类型；
 * @typeParam F - 表单字段的值类型，如果涉及到类型转换，那么该值可能就是 T[name] 的类型了；
 */
export type FormFieldContext<
	A extends FormAttrs = FormAttrs,
	T extends Flattenable = Flattenable,
	F = Flatten<T>[FlattenKeys<T>],
> = FormField<F> & {
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
 * 向子组件提供操作表单对象 A 中指定字段的方法
 *
 * @typeParam A - 表单字段的属性类型；
 * @typeParam T - 表单对象的类型；
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
 *
 * @param conv 将对象中的字段类型转换为 F；
 * @typeParam A - 表单字段的属性类型；
 * @typeParam T - 表单对象的类型；
 * @typeParam F - 表单字段的值类型；
 * @remarks
 * 部分对象字段可能有不同的类型表示，比如时间，后端给的可能是字段串或是时间戳，
 * 与组件使用类型未必是相同的，此时可使用参数 conv 进行转换后返回。
 */
export function useFormField<
	A extends FormAttrs = FormAttrs,
	T extends Flattenable = Flattenable,
	F = Flatten<T>[FlattenKeys<T>],
>(conv?: Converter<Flatten<T>[FlattenKeys<T>] | undefined, F | undefined>): FormFieldContext<A, T, F> | undefined {
	if (!conv) {
		return useContext(formFieldContext) as FormFieldContext<A, T, F>;
	}

	const ctx = useContext(formFieldContext) as FormFieldContext<A, T, Flatten<T>[FlattenKeys<T>]>;

	const getValue = (
		conv
			? () => {
					const v = ctx.getValue() as Flatten<T>[FlattenKeys<T>] | undefined;
					return conv.from(v);
				}
			: ctx.getValue
	) as FormField<F>['getValue'];

	const setValue = (
		conv
			? (v, silent) => {
					const val = conv.to(v);
					ctx.setValue(val, silent);
				}
			: ctx.setValue
	) as FormField<F>['setValue'];

	const onChange = (
		conv && ctx.onChange
			? (f: ChangeFunc<F | undefined>) => {
					ctx.onChange((val, old) => {
						f(
							conv.from(val as Flatten<T>[FlattenKeys<T>] | undefined),
							conv.from(old as Flatten<T>[FlattenKeys<T>] | undefined),
						);
					});
				}
			: ctx.onChange
	) as FormField<F>['onChange'];

	return { ...ctx, onChange, getValue, setValue } as FormFieldContext<A, T, F>;
}
