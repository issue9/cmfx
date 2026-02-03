// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createContext, JSX, ParentProps, splitProps, useContext } from 'solid-js';

import { CommonProps } from './types';

/**
 * 提供了表单的上下文环境
 *
 * @remarks
 * 在表单中的组件，部分属性可以通过此上下文环境进行设置。
 */
export type FormContext = CommonProps;

const formContext = createContext<FormContext>({} as FormContext);

/**
 * 表单的实现者需要调用此组件用于给表单的组件提供上下文环境。
 */
export function FormProvider(props: ParentProps<FormContext>): JSX.Element {
	const [, val] = splitProps(props, ['children']);
	return <formContext.Provider value={val}>{props.children}</formContext.Provider>;
}

/**
 * 获取最近一个表单的上下文环境
 */
export function useForm(): FormContext {
	return useContext(formContext);
}
