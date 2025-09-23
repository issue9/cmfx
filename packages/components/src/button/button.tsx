// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey } from '@cmfx/core';
import { JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';

import { classList } from '@/base';
import styles from './style.module.css';
import { Props as BaseProps, presetProps as presetBaseProps } from './types';

export type Ref = HTMLButtonElement;

export interface Props extends BaseProps, Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
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
    const [_, btnProps] = splitProps(props, ['kind', 'rounded', 'palette', 'children', 'classList', 'square', 'class']);
    let ref: HTMLButtonElement;

    if (props.hotkey && props.onClick) {
        onMount(() => {
            Hotkey.bind(props.hotkey!, () => { ref.click(); });
        });
        onCleanup(() => Hotkey.unbind(props.hotkey!));
    }

    return <button ref={el => ref = el} {...btnProps} class={classList(props.palette, {
        [styles.square]: props.square,
        [styles.rounded]: props.rounded,
        [styles.checked]: props.checked,
        ...props.classList
    }, styles.button, styles[props.kind!], props.class)}>
        {props.children}
    </button>;
}
