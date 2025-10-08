// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey } from '@cmfx/core';
import { JSX, mergeProps, onCleanup, onMount, ParentProps, splitProps } from 'solid-js';

import { classList, RefProps } from '@/base';
import styles from './style.module.css';
import { Props as BaseProps, presetProps as presetBaseProps } from './types';

export interface Ref {
    element(): HTMLButtonElement;
}

export interface Props extends BaseProps, ParentProps, RefProps<Ref> {
    /**
     * 是否为一个长宽比为 1:1 的按钮
     *
     * @remarks 比如图标之类可能需要此属性，
     * 但是单字符按钮如果需要显示正方形不能指定此属性，因为字符本身就是不是正方式的。
     */
    square?: boolean;

    /**
     * 按钮内容
     */
    children: JSX.Element;

    /**
     * 是否处于选中状态
     */
    checked?: boolean;

    type?: JSX.ButtonHTMLAttributes<HTMLButtonElement>['type'];

    onclick?: JSX.ButtonHTMLAttributes<HTMLButtonElement>['onclick'];

    autofocus?: boolean;

    disabled?: boolean;

    title?: string;
}

export const presetProps: Readonly<Partial<Props>> = {
    ...presetBaseProps,
    type: 'button'
};

/**
 * 普通的按钮组件
 */
export function Button(props: Props) {
    props = mergeProps(presetProps, props);
    const [_, btnProps] = splitProps(props, ['kind', 'rounded', 'palette', 'children', 'square', 'class', 'ref']);
    let ref: Ref;

    if (props.hotkey && props.onclick) {
        onMount(() => {
            Hotkey.bind(props.hotkey!, () => { ref!.element().click(); });
        });
        onCleanup(() => Hotkey.unbind(props.hotkey!));
    }

    return <button {...btnProps} class={classList(props.palette, {
        [styles.square]: props.square,
        [styles.rounded]: props.rounded,
        [styles.checked]: props.checked,
    }, styles.button, styles[props.kind!], props.class)} ref={el => {
        if (!props.ref) { return; }
        props.ref({ element: () => el });
    }}
    >
        {props.children}
    </button>;
}
