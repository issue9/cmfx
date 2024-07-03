// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show, splitProps } from 'solid-js';

import { Color } from '@/components/base';

import { Type } from './types';

export interface Props extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: Color;
    t?: Type;
    leftIcon?: string;
    rightIcon?: string;
    rounded?: boolean;
}

const defaultProps: Props = {
    color: 'primary',
    t: 'filled'
};

/**
 * 普通的非响应式按钮
 */
export default function XButton(props: Props) {
    props = mergeProps(defaultProps, props);

    const [_, others] = splitProps(props, ['color', 't', 'leftIcon', 'rightIcon', 'rounded']);
    return <button {...others} classList={{
        [`button--${props.t}`]: true,
        [`scheme--${props.color}`]: true,
        'rounded-full': props.rounded,
        'icon-container': !!(props.leftIcon || props.rightIcon)
    }}>
        <Show when={props.leftIcon}>
            <span class="material-symbols-outlined mr-1">{props.leftIcon}</span>
        </Show>
        {props.children}
        <Show when={props.rightIcon}>
            <span class="material-symbols-outlined ml-1">{props.rightIcon}</span>
        </Show>
    </button>;
}
