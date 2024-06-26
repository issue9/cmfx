// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, splitProps } from 'solid-js';

import { Color } from '@/components/base';

import { Type } from './types';

export interface Props extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    color: Color;
    t?: Type;
}

export default function XIconButton(props: Props) {
    const cls = `${props.color}-${props.t}-icon-button`;
    const [_, others] = splitProps(props, ['color', 't']);
    return <button class={cls} {...others}>{props.children}</button>;
}
