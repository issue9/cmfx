// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { Color } from '@/components/base';

export interface Props {
    color?: Color;

    /**
     * 控制弹出内容的可见性
     */
    visible?: boolean;

    /**
     * 触发元素
     */
    activator: JSX.Element;

    /**
     * 弹出内容的位置，相对于 activator
     */
    pos?: Position;

    /**
     * 弹出的内容
     */
    children: JSX.Element;
}

export const positions = ['topleft', 'topright', 'bottomleft', 'bottomright'] as const;

export type Position = typeof positions[number];

const defaultProps: Partial<Props> = {
    color: undefined,
    pos: 'bottomright'
};

export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    return <div classList={{
        'dropdown': true,
        [`scheme--${props.color}`]: !!props.color
    }}>
        {props.activator}

        <div classList={{
            'content': true,
            [`${props.pos}`]: true,
            'visible': props.visible
        }}>
            {props.children}
        </div>
    </div>;
}
