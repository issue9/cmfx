// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX } from 'solid-js';

import { BaseProps } from '@/components/base';
import { FormAccessor } from './access';

export interface Props<T extends object, R = never, P = never> extends BaseProps {
    formAccessor: FormAccessor<T, R, P>;

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
export default function<T extends object, R = never, P = never>(props: Props<T,R,P>) {
    const [loading, setLoading] = createSignal(false);
    props.formAccessor.withLoadingSetter(setLoading);

    return <form method={props.inDialog ? 'dialog' : undefined} classList={{
        'c--form': true,
        'c--form-loading': loading(),
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <fieldset disabled={loading()}>
            {props.children}
        </fieldset>
    </form>;
}
