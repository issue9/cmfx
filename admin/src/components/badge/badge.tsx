// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { Color } from '@/components/base';

export const postions = ['topleft', 'topright', 'bottomleft', 'bottomright'] as const;

export type Postion = typeof postions[number];

export interface Props {
    color?: Color;
    pos?: Postion;
    text?: string | number;
    children: JSX.Element;
}

const defaultProps: Partial<Props> = {
    color: 'primary',
    pos: 'topright'
};

export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    return <div class="badge">
        {props.children}
        <span class={`content scheme--${props.color} ${props.pos}`}>{ props.text }</span>
    </div>;
}
