// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, ParentProps } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import styles from './style.module.css';

/**
 * 组件的四个角
 */
export const corners = ['topleft', 'topright', 'bottomleft', 'bottomright'] as const;

export type Corner = typeof corners[number];

export interface Props extends BaseProps, ParentProps {
    /**
     * 位置
     *
     * @reactive
     */
    pos?: Corner;

    /**
     * 微标是否为圆形
     *
     * @reactive
     */
    rounded?: boolean;

    /**
     * 角上的内容
     *
     * @reactive
     */
    content?: JSX.Element;
}

const presetProps: Readonly<Partial<Props>> = {
    pos: 'topright'
};

/**
 * 微标组件
 */
export function Badge(props: Props) {
    props = mergeProps(presetProps, props);

    return <div class={joinClass(props.palette, styles.badge, props.class)} style={props.style}>
        {props.children}
        <span class={joinClass(undefined, props.rounded ? 'rounded-full' : '', styles[props.pos!], styles.point)}>
            {props.content}
        </span>
    </div>;
}
