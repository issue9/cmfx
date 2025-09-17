// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, ParentProps } from 'solid-js';

import { BaseProps, classList, Layout } from '@/base';
import styles from './style.module.css';

export type Props = ParentProps<{
    /**
     * 如果存在文字，表示文字的位置，否则该值无意义。
     *
     * @remarks 在 children 不为空的情况下，如果未指定 pos，会初始化 'start'。
     */
    pos?: 'start' | 'center' | 'end';

    /**
     * 组件布局方向
     */
    layout?: Layout;

    /**
     * 交叉轴上的留白
     *
     * @remarks 语法与 CSS 中的 padding-block 和 padding-inline 相同。可以用一个值或是两个值：
     *  - padding: 10px；
     *  - padding: 10px 10px；
     *  - padding: 5% 10%；
     */
    padding?: string;
} & BaseProps>;

const presetProps: Readonly<Props> = {
    pos: 'start',
    layout: 'horizontal'
};

/**
 * 分割线
 */
export function Divider(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    return <div role="separator" aria-orientation={props.layout}
        style={{ [props.layout === 'horizontal' ? 'padding-block' : 'padding-inline']: props.padding }}
        class={classList({
            [styles.vertical]: props.layout !== 'horizontal',
            [styles[`pos-${props.children ? (props.pos ?? 'none') : 'none'}`]]: true,
        }, styles.divider, props.palette ? `palette--${props.palette}` : '', props.class)}>
        {props.children}
    </div>;
}
