// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Flattenable } from '@cmfx/core';
import { mergeProps, ParentProps } from 'solid-js';

import { BaseProps, joinClass, Layout } from '@/base';
import { Spin } from '@/spin';
import { FormAccessor } from './access';
import { FormProvider } from './field';
import styles from './style.module.css';

export interface Props<T extends Flattenable, R = never, P = never> extends BaseProps, ParentProps {
    formAccessor: FormAccessor<T, R, P>;

    /**
     * 表单位于对话框中
     *
     * 如果指定了该属性，那么表单的 submit 按钮将会关闭对话框，
     * 且 submit 按钮的 value 属性会传递给 dialog.returnValue。
     */
    inDialog?: boolean;

    // 以下为 FormContext 的属性

    /**
     * 子组件的 layout 属性的默认值
     *
     * @remarks 同时也影响整个 Form 组件的布局。
     * @reactive
     */
    layout?: Layout;

    /**
     * 子组件的 hasHelp 属性的默认值
     *
     * @reactive
     */
    hasHelp?: boolean;

    /**
     * 子组件的 rounded 属性的默认值
     *
     * @reactive
     */
    rounded?: boolean;
}

const preset = {
    layout: 'horizontal' as Layout,
    hasHelp: true,
} as const;

/**
 * 表单组件
 */
export function Form<T extends Flattenable, R = never, P = never>(props: Props<T, R, P>) {
    props = mergeProps(preset, props);

    return <FormProvider layout={props.layout} hasHelp={props.hasHelp} rounded={props.rounded}>
        <Spin spinning={props.formAccessor.submitting()} palette={props.palette} class={props.class} style={props.style}>
            <form class={joinClass(undefined, styles.form, props.layout === 'vertical' ? 'flex-col' : '')}
                method={props.inDialog ? 'dialog' : undefined}
                {...props.formAccessor.events()}>
                {props.children}
            </form>
        </Spin>
    </FormProvider>;
}
