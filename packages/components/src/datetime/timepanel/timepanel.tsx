// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, createEffect, createSignal, untrack } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import { DateChange, hoursOptions, minutesOptions } from '@/datetime/utils';
import styles from './style.module.css';

export interface Props extends BaseProps {
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
    onChange?: DateChange;

    ref?: { (el: HTMLElement): void; };

    class?: string;
}

/**
 * 时间选择面板
 */
export default function TimePanel(props: Props) {
    let ref: HTMLFieldSetElement;
    const [value, setValue] = createSignal<Date>(props.value ?? new Date()); // 面板上当前页显示的时候

    const scrollTimer = () => {
        const items = ref.querySelectorAll(`ul>li.${styles.selected}`);
        console.log('items:', items);
        if (items && items.length > 0) {
            for (const item of items) {
                const p = item.parentElement;
                const top = item.getBoundingClientRect().top - p!.getBoundingClientRect().top;

                // scrollBy 与 scrollIntoView 不同点在于，scrollBy 并不会让整个 p 出现在页面的可见范围之内。
                p!.scrollBy({ top: top, behavior: 'smooth' });
            }
        }
    };

    const change = (val?: Date) => {
        const old = untrack(value);

        setValue(val ?? new Date());
        requestIdleCallback(() => { scrollTimer(); }); // 保证在页面设置完之后，再进行滚动。

        if (props.onChange) { props.onChange(val, old); }
    };

    createEffect(() => { change(props.value); });

    return <fieldset disabled={props.disabled} popover={props.popover}
        class={joinClass(styles.time, props.palette ? `palette--${props.palette}` : undefined, props.class)}
        ref={ el => {
            ref = el;
            if (props.ref) { props.ref(el); }
        }}>
        <ul class={styles.item}>
            <For each={hoursOptions}>
                {item => (
                    <li classList={{ [styles.selected]: value().getHours() == item[0] }}
                        onClick={() => {
                            if (props.disabled || props.readonly) { return; }
                            const dt = new Date(value());
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
                    <li classList={{ [styles.selected]: value().getMinutes() == item[0] }}
                        onClick={() => {
                            if (props.disabled || props.readonly) { return; }
                            const dt = new Date(value());
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
                    <li classList={{ [styles.selected]: value().getSeconds() == item[0] }}
                        onClick={() => {
                            if (props.disabled || props.readonly) { return; }
                            const dt = new Date(value());
                            dt.setSeconds(item[0]);
                            change(dt);
                        }}
                    >{item[1]}</li>
                )}
            </For>
        </ul>
    </fieldset>;
}
