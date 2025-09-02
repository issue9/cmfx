// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createContext, JSX, ParentProps, splitProps, useContext } from 'solid-js';

import { Layout } from '@/base';

/**
 * 提供了表单的上下文环境
 *
 * 在表单中的组件，部分属性可以通过此上下文环境进行设置。
 */
export interface FormContext {
    /**
     * 组件是否为圆角
     */
    rounded?: boolean;

    /**
     * 是否应该为帮助信息预留位置
     */
    hasHelp?: boolean;

    /**
     * 组件的布局方式
     */
    layout?: Layout;
}

const ctx = createContext<FormContext>({} as FormContext);

/**
 * 表单的实现者需要调用此组件用于给表单的组件提供上下文环境。
 */
export function FormProvider(props: ParentProps<FormContext>): JSX.Element {
    const [, val] = splitProps(props, ['children']);
    return <ctx.Provider value={val}>{props.children}</ctx.Provider>;
}

/**
 * 获取最近一个表单的上下文环境
 */
export function useForm(): FormContext {
    return useContext(ctx);
}
