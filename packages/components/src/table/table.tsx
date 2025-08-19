// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { ParentProps } from 'solid-js';

import { BaseProps, classList } from '@/base';
import styles from './style.module.css';

export interface Props extends BaseProps, ParentProps {
    /**
     * 是否根据第一行数据或是 col 的定义固定列的宽度，这可以提升一些渲染性能，
     * 但是可能会造成空间的巨大浪费。具体可查看：
     * {@link https://developer.mozilla.org/zh-CN/docs/Web/CSS/table-layout}
     *
     * @reactive
     */
    fixedLayout?: boolean;

    /**
     * 指定条纹色的间隔
     * - 0 表示没有；
     *
     * @reactive
     */
    striped?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

    /**
     * tr 是否响应 hover 事件
     *
     * @reactive
     */
    hoverable?: boolean;

    ref?: { (el: HTMLTableElement): void };
}

/**
 * 这是对 table 的封装，提供了基本的样式和功能
 *
 * 所有的依赖和限制与内置的 table 元素相同
 */
export function Table(props: Props) {
    return <table ref={el=>props.ref?.(el)} class={classList({
        [styles['fixed-layout']]: props.fixedLayout,
        [styles.hoverable]: props.hoverable,
        [`palette--${props.palette}`]: !!props.palette,
        [styles[`striped-${props.striped}`]]: !!props.striped
    },styles['cmfx-table'], props.class)}>
        {props.children}
    </table>;
}
