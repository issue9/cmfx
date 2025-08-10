// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import { IconComponent } from '@/icon';
import { Label } from '@/typography';
import styles from './style.module.css';

export interface Props extends BaseProps {
    /**
     * 指定统计数据，各个字段说明如下：
     *  - label 显示标题；
     *  - value 显示的值；
     *  - icon 可选的图标；
     */
    items: Array<[label: string, value: string | number, icon?: IconComponent]>;
}

/**
 * 提供显示一组统计数据
 */
export default function Statistics(props: Props): JSX.Element {
    return <div class={joinClass(styles.statistics, props.palette ? `palette--${props.palette}` : '', props.class)}>
        <For each={props.items}>
            {item => (
                <div class={styles.statistic}>
                    <Label icon={item[2]}>{ item[0] }</Label>
                    <div class={ styles.value }>{item[1]}</div>
                </div>
            )}
        </For>
    </div>;
}
