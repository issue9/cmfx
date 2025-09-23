// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import equal from 'fast-deep-equal';
import { createEffect, createSignal, For, JSX } from 'solid-js';

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
    value: string | Scheme;

    /**
     * 修改主题值时触发的事件
     */
    onChange?: { (val: string, old?: string): void; };
}

/**
 * 主题选择组件
 */
export function Selector(props: Props): JSX.Element {
    const [value, setValue] = createSignal<string>();

    // 监视外部变化
    createEffect(() => {
        if (typeof props.value === 'string') {
            setValue(props.value);
        } else {
            const v = props.schemes.entries().some(s => {
                if (equal(s[1], props.value)) {
                    setValue(s[0]);
                    return true;
                }
            });
            if (!v) { setValue(undefined); }
        }
    });

    return <div class={joinClass(props.palette, styles.selector, props.class)}>
        <For each={Array.from(props.schemes.entries())}>
            {scheme => {
                const colors = scheme[1].dark!;

                return <button
                    class={joinClass(undefined, styles.option, value() === scheme[0] ? styles.selected : '')}
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
