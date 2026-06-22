// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flattenable } from '@cmfx/core';
import { createContext, type JSX, type ParentProps, splitProps, useContext } from 'solid-js';

import type { API } from '@components/form/api';
import type { CommonProps } from './types';

export type FormContext<T extends Flattenable, R = unknown, P = never> = CommonProps & {
	/**
	 * 表单的 id 属性
	 */
	id?: string;

	api: API<T, R, P>;
};

// biome-ignore lint/complexity/noBannedTypes: 顶层元素是空的对象
type TopFormContext = FormContext<{}>;

const formContext = createContext<TopFormContext>();

/**
 * 表单的实现者需要调用此组件用于给表单的组件提供上下文环境。
 */
export function FormProvider<T extends Flattenable, R = unknown, P = never>(
	props: ParentProps<FormContext<T, R, P>>,
): JSX.Element {
	const [, val] = splitProps(props, ['children']);
	return <formContext.Provider value={val as unknown as TopFormContext}>{props.children}</formContext.Provider>;
}

/**
 * 获取最近一个表单的上下文环境
 *
 * @paramType T - 表单的数据类型；
 */
export function useForm<T extends Flattenable, R = unknown, P = never>(): FormContext<T, R, P> | undefined {
	// biome-ignore lint/suspicious/noExplicitAny: TopFormContext 不符合 FormContext<T> 的要求
	return useContext<FormContext<T, R, P>>(formContext as any);
}
