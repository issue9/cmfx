// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { BaseProps, classList } from '@/base';
import { Spin } from '@/spin';
import { FormAccessor } from './access';

export interface Props<T extends object, R = never, P = never> extends BaseProps {
    formAccessor: FormAccessor<T, R, P>;

    class?: string;
    classList?: JSX.CustomAttributes<HTMLElement>['classList'];

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
    return <form method={props.inDialog ? 'dialog' : undefined} {...props.formAccessor.events()} class={classList(props.class, {
        ...props.classList,
        'c--form':true,
        [`palette--${props.palette}`]: !!props.palette,
    })}>
        <Spin spinning={props.formAccessor.submitting()}>{props.children}</Spin>
    </form>;
}
