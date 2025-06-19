// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import { Spin } from '@/spin';
import { FormAccessor } from './access';
import styles from './style.module.css';

export interface Props<T extends object, R = never, P = never> extends BaseProps {
    formAccessor: FormAccessor<T, R, P>;

    class?: string;

    /**
     * 表单位于对话框中
     *
     * 如果指定了该属性，那么表单的 submit 按钮将会关闭对话框，且 submit 按钮的 value 属性会传递给 dialog.returnValue。
     */
    inDialog?: boolean;

    children: JSX.Element;
}

/**
 * 表单组件
 */
export function Form<T extends object, R = never, P = never>(props: Props<T,R,P>) {
    return <Spin spinning={props.formAccessor.submitting()} palette={props.palette}>
        <form class={joinClass(styles.form, props.class)}
            method={props.inDialog ? 'dialog' : undefined}
            {...props.formAccessor.events()}>
            {props.children}
        </form>
    </Spin>;
}
