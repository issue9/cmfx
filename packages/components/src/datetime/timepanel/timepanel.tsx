// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, createSignal, For, JSX, onMount, untrack } from 'solid-js';

import { BaseProps, joinClass, RefProps } from '@/base';
import { hoursOptions, minutesOptions } from '@/datetime/utils';
import styles from './style.module.css';

export interface Ref {
    root(): HTMLFieldSetElement;
}

export interface Props extends BaseProps, RefProps<Ref> {
    disabled?: boolean;
    readonly?: boolean;

    popover?: boolean | 'manual' | 'auto';

    /**
     * 关联的值
     */
    value?: Date;

    /**
     * 值发生改变时触发的事件
     */
    onChange?: { (val?: Date, old?: Date): void; };
}

/**
 * 时间选择面板
 */
export default function TimePanel(props: Props): JSX.Element {
    let ref: HTMLFieldSetElement;
    const zero = new Date(0);
    zero.setHours(0, 0, 0, 0);

    const [value, setValue] = createSignal<Date | undefined>(props.value);

    const scrollTimer = () => {
        const items = ref.querySelectorAll(`ul>li.${styles.selected}`);
        for (const item of items) {
            const p = item.parentElement!;

            // scrollBy 与 scrollIntoView 不同点在于，scrollBy 并不会让整个 p 出现在页面的可见范围之内。
            const top = item.getBoundingClientRect().top - p.getBoundingClientRect().top;
            p.scrollBy({ top: top, behavior: 'smooth' });
        }
    };

    const val = createMemo(() => { return value() ?? zero; });

    const change = (val?: Date) => {
        const old = untrack(value);

        setValue(val);
        requestIdleCallback(() => { scrollTimer(); }); // 保证在页面设置完之后，再进行滚动。

        if (props.onChange) { props.onChange(val, old); }
    };

    createEffect(() => {
        if (props.value !== value()) { change(props.value); }
    });

    onMount(() => { scrollTimer(); });

    return <fieldset disabled={props.disabled} popover={props.popover}
        class={joinClass(props.palette, styles.time, props.class)} style={props.style}
        ref={ el => {
            ref = el;
            if (props.ref) { props.ref({ root() { return el; }}); }
        }}>
        <ul class={styles.item}>
            <For each={hoursOptions}>
                {item => (
                    <li classList={{ [styles.selected]: val().getHours() == item[0] }}
                        onClick={() => {
                            if (props.disabled || props.readonly) { return; }
                            const dt = new Date(val());
                            dt.setHours(item[0]);
                            change(dt);
                        }}
                    >{item[1]}</li>
                )}
            </For>
        </ul>

        <ul class={styles.item}>
            <For each={minutesOptions}>
                {item => (
                    <li classList={{ [styles.selected]: val().getMinutes() == item[0] }}
                        onClick={() => {
                            if (props.disabled || props.readonly) { return; }
                            const dt = new Date(val());
                            dt.setMinutes(item[0]);
                            change(dt);
                        }}
                    >{item[1]}</li>
                )}
            </For>
        </ul>

        <ul class={styles.item}>
            <For each={minutesOptions}>
                {item => (
                    <li classList={{ [styles.selected]: val().getSeconds() == item[0] }}
                        onClick={() => {
                            if (props.disabled || props.readonly) { return; }
                            const dt = new Date(val());
                            dt.setSeconds(item[0]);
                            change(dt);
                        }}
                    >{item[1]}</li>
                )}
            </For>
        </ul>
    </fieldset>;
}
