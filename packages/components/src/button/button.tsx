// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey } from '@cmfx/core';
import { JSX, mergeProps, onCleanup, onMount, splitProps } from 'solid-js';

import { Props as BaseProps, presetProps as presetBaseProps } from './types';

export type Ref = HTMLButtonElement;

export interface Props extends BaseProps, Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    /**
     * 是否仅包含一个图标
     *
     * 如果该值为 true，会调整按钮的的边距，使按钮成为一个正方形。
     */
    icon?: boolean;

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
    const [_, btnProps] = splitProps(props, ['kind', 'rounded', 'palette', 'children', 'classList']);
    let ref: HTMLButtonElement;

    if (props.hotkey && props.onClick) {
        onMount(() => {
            Hotkey.bind(props.hotkey!, () => { ref.click(); });
        });
        onCleanup(() => Hotkey.unbind(props.hotkey!));
    }

    return <button ref={el => ref = el} {...btnProps} classList={{
        'c--button': true,
        'c--button-icon': props.icon,
        [`c--button-${props.kind}`]: true,
        [`palette--${props.palette}`]: !!props.palette,
        'rounded-full': props.rounded,
        'checked': props.checked,
        ...props.classList
    }}>
        {props.children}
    </button>;
}
