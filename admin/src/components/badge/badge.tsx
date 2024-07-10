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
    color: undefined,
    pos: 'topright'
};

export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    return <div class="badge">
        {props.children}
        <span classList={{
            'content': true,
            [props.pos as string]: true,
            [`scheme--${props.color}`]: props.color ? true : false
        }}>{ props.text }</span >
    </div>;
}
