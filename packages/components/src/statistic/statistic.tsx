// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, Show } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import { Counter, CounterProps } from '@/counter';
import styles from './style.module.css';

export interface Props extends BaseProps {
    /**
     * 显示的标题
     *
     * @reactive
     */
    label: JSX.Element;

    /**
     * 显示的值
     *
     * @reactive
     */
    value: number;

    /**
     * {@link value} 的显示方式
     */
    formatter?: CounterProps['formatter'];

    /**
     * 图标
     *
     * @reactive
     */
    icon?: JSX.Element;
}

/**
 * 提供显示一组统计数据
 */
export default function Statistic(props: Props): JSX.Element {
    return <div class={joinClass(props.palette, styles.statistic)}>
        <div class={styles.label}>{props.label}</div>
        <div class={styles.content}>
            <Show when={props.icon}>{c => { return c(); }}</Show>
            <Counter value={props.value} formatter={props.formatter} />
        </div>
    </div>;
}
