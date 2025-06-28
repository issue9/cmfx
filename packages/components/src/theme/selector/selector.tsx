// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX } from 'solid-js';

import { BaseProps, joinClass, Scheme } from '@/base';
import { createSignal } from 'solid-js';
import styles from './style.module.css';

export interface Props extends BaseProps {
    /**
     * 主题列表
     */
    schemes: Map<string, Scheme>;

    /**
     * 当前的主题值
     */
    value: string;

    /**
     * 修改主题值时触发的事件
     */
    onChange?: { (val: string, old: string): void; };
}

/**
 * 主题选择组件
 */
export function Selector(props: Props): JSX.Element {
    const [value, setValue] = createSignal(props.value);

    return <div class={joinClass(styles.selector, props.palette ? `palette--${props.palette}` : undefined)}>
        <For each={Array.from(props.schemes.entries())}>
            {(scheme) => {
                const colors = scheme[1].dark!;

                return <div tabIndex={0} class={joinClass(styles.option, value() === scheme[0] ? styles.selected : undefined)} onClick={() => {
                    if (!props.onChange) { return; }

                    const old = value();
                    setValue(scheme[0]);
                    props.onChange(scheme[0], old);
                }}>
                    <div class={styles.blocks}>
                        <div class={styles.block} style={{ 'background-color': colors['primary-bg'] }}></div>
                        <div class={styles.block} style={{ 'background-color': colors['secondary-bg'] }}></div>
                        <div class={styles.block} style={{ 'background-color': colors['tertiary-bg'] }}></div>
                        <div class={styles.block} style={{ 'background-color': colors['surface-bg'] }}></div>
                    </div>
                    <div class={styles.info}>
                        <div>{scheme[0]}</div>
                        <div>WCAG: TODO </div>
                    </div>
                </div>;
            }}
        </For>
    </div>;
}
