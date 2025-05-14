// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { BaseProps } from '@/base';

/**
 * 组件的四个角
 */
export const corners = ['topleft', 'topright', 'bottomleft', 'bottomright'] as const;

export type Corner = typeof corners[number];

export interface Props extends BaseProps {
    /**
     * 位置
     */
    pos?: Corner;

    /**
     * 角上的内容
     */
    text?: string | number;

    children: JSX.Element;
}

const presetProps: Readonly<Partial<Props>> = {
    pos: 'topright'
};

export function Badge(props: Props) {
    props = mergeProps(presetProps, props);

    return <div class="c--badge">
        {props.children}
        <span classList={{
            'content': true,
            [props.pos as string]: true,
            [`palette--${props.palette}`]: !!props.palette,
        }}>{ props.text }</span>
    </div>;
}
