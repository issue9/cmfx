// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { BaseProps, classList } from '@/base';
import styles from './style.module.css';

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

    return <div class={styles.badge}>
        {props.children}
        <span class={classList({
            [`palette--${props.palette}`]: !!props.palette,
        }, styles[props.pos!], styles.point)}>{ props.text }</span>
    </div>;
}
