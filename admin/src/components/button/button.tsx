// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show, splitProps } from 'solid-js';

import { Color } from '@/components/base';

import { Type } from './types';

export interface Props extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: Color;
    t?: Type;
    // TODO loading
    leftIcon?: string;
    rightIcon?: string;
    rounded?: boolean;
}

/**
 * 普通的非响应式按钮
 */
export default function XButton(props: Props) {
    props = mergeProps({ color: 'primary' }, props) as Props;

    let cls = `button--${props.t} scheme--${props.color}`;

    if (props.rounded) {
        cls += ' rounded-full';
    }
    if (props.leftIcon || props.rightIcon) {
        cls += ' icon-container';
    }

    const [_, others] = splitProps(props, ['color', 't', 'leftIcon', 'rightIcon', 'rounded']);
    return <button class={cls} disabled={props.disabled} {...others}>
        <Show when={props.leftIcon}>
            <span class="material-symbols-outlined mr-1">{props.leftIcon}</span>
        </Show>
        {props.children}
        <Show when={props.rightIcon}>
            <span class="material-symbols-outlined ml-1">{props.rightIcon}</span>
        </Show>
    </button>;
}
