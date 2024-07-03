// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, splitProps } from 'solid-js';

import { Color } from '@/components/base';

import { Type } from './types';

export interface Props extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: Color;
    t?: Type;
    rounded?: boolean;
}

const defaultProps: Props = {
    color: 'primary',
    t: 'filled'
};

export default function XIconButton(props: Props) {
    props = mergeProps(defaultProps, props);

    const [_, others] = splitProps(props, ['color', 't']);
    return <button {...others}
        classList={{
            [`icon-button--${props.t}`]: true,
            [`scheme--${props.color}`]:true,
            'rounded-full': props.rounded,
        }}>{props.children}</button>;
}
