// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For, JSX, mergeProps } from 'solid-js';

import { BaseProps, joinClass, Scheme } from '@/base';
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

    tabIndex?: number;
}

const presetProps: Partial<Props> = {
    tabIndex: 0
} as const;

/**
 * 主题选择组件
 */
export function Selector(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    const [value, setValue] = createSignal(props.value);

    return <div class={joinClass(styles.selector, props.palette ? `palette--${props.palette}` : undefined)}>
        <For each={Array.from(props.schemes.entries())}>
            {scheme => {
                const colors = scheme[1].dark!;

                return <button tabIndex={props.tabIndex}
                    class={joinClass(styles.option, value() === scheme[0] ? styles.selected : undefined)}
                    onClick={() => {
                        const old = value();
                        setValue(scheme[0]);

                        if (props.onChange) { props.onChange(scheme[0], old); }
                    }}>
                    <div class={styles.blocks}>
                        <div class={styles.block} style={{ 'background-color': colors['primary-bg'] }}></div>
                        <div class={styles.block} style={{ 'background-color': colors['secondary-bg'] }}></div>
                        <div class={styles.block} style={{ 'background-color': colors['tertiary-bg'] }}></div>
                        <div class={styles.block} style={{ 'background-color': colors['surface-bg'] }}></div>
                    </div>
                    <div class={styles.info}>
                        <div>{scheme[0]}</div>
                        <div>WCAG: {scheme[1].contrast}</div>
                    </div>
                </button>;
            }}
        </For>
    </div>;
}
