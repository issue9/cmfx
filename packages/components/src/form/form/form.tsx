// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Flattenable } from '@cmfx/core';
import { createMemo, mergeProps, ParentProps } from 'solid-js';

import { BaseProps, joinClass, Layout } from '@/base';
import { Spin } from '@/spin';
import { FormProvider } from '@/form/field';
import { FormAPI } from './api';
import styles from './style.module.css';

export interface Props<T extends Flattenable, R = never, P = never> extends BaseProps, ParentProps {
    accessor: FormAPI<T, R, P>;

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

    const cls = createMemo(() => {
        return joinClass(
            undefined,
            styles.form,
            props.layout === 'vertical' ? 'flex-col' : '',
            props.class
        );
    });

    return <FormProvider layout={props.layout} hasHelp={props.hasHelp} rounded={props.rounded}>
        <Spin tag="form" spinning={props.accessor.submitting()}
            palette={props.palette} class={cls()} style={props.style} ref={el => {
                const f = el.element() as HTMLFormElement;
                if (props.inDialog) { f.method = 'dialog'; }

                f.addEventListener('reset', e => {
                    props.accessor.reset();
                    e.preventDefault();
                });
                f.addEventListener('submit', e => {
                    props.accessor.submit();
                    e.preventDefault();
                });
            }}
        >
            {props.children}
        </Spin>
    </FormProvider>;
}
