// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flatten, Flattenable, FlattenKeys } from '@cmfx/core';
import { createContext, type JSX, type ParentProps, splitProps, useContext } from 'solid-js';

import type { FieldContext } from './field';
import type { CommonProps } from './types';

export type FormContext<T extends Flattenable> = CommonProps & {
	/**
	 * 表单的 id 属性
	 */
	id?: string;

	/**
	 * 为子属性创建 FieldContext 实例
	 *
	 * @param id 字段的唯一标识；
	 * @param key 字段名，如果是子属性，需要用 . 进行分隔，比如 parent.child；
	 */
	createField: (id: string, key: FlattenKeys<T>, tabindex?: number) => FieldContext<Flatten<T>[FlattenKeys<T>]>;
};

// biome-ignore lint/complexity/noBannedTypes: 顶层元素是空的对象
type TopFormContext = FormContext<{}>;

const formContext = createContext<TopFormContext>();

/**
 * 表单的实现者需要调用此组件用于给表单的组件提供上下文环境。
 */
export function FormProvider<T extends Flattenable>(props: ParentProps<FormContext<T>>): JSX.Element {
	const [, val] = splitProps(props, ['children']);
	return <formContext.Provider value={val as TopFormContext}>{props.children}</formContext.Provider>;
}

/**
 * 获取最近一个表单的上下文环境
 *
 * @paramType T - 表单的数据类型；
 */
export function useForm<T extends Flattenable>(): FormContext<T> | undefined {
	// biome-ignore lint/suspicious/noExplicitAny: TopFormContext 不符合 FormContext<T> 的要求
	return useContext<FormContext<T>>(formContext as any);
}
