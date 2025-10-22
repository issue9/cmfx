// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { createEffect, createSignal, JSX, mergeProps, onMount } from 'solid-js';

import { BaseProps, joinClass, RefProps, transitionDuration } from '@/base';
import styles from './style.module.css';

export interface Ref {
    element(): HTMLDivElement;

    play(): void;
}

export interface Props extends BaseProps, RefProps<Ref> {
    /**
     * 起始数值
     *
     * @defaultValue 0
     * @reactive
     */
    start?: number;

    /**
     * 最终显示的数值
     * @reactive
     */
    value: number;

    /**
     * 对数值进行格式化的方法
     *
     * @remarks 一般情况下，该方法可以对数值进行一些格式化操作，比如固定小数位，或是进行本地化的操作。
     * 如果该值为空，那么将原样返回。
     */
    formatter?: { (val: number): string; };

    /**
     * 动画频率，数值越高，动画效果越丝滑，默认为 20。
     *
     * @defaultValue 20
     * @reactive
     */
    frequency?: number;
}

const presetProps: Readonly<Partial<Props>> = {
    start: 0,
    formatter: (v: number): string => v.toFixed(0),
    frequency: 20,
} as const;

/**
 * 一个跳动的计数器组件
 *
 * @remarks 该组件不受 `@media (prefers-reduced-motion: reduce)` 的影响。
 */
export default function Counter(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    let dur = transitionDuration(); // 先获取一个全局的作为默认值

    const [value, setValue] = createSignal<string>(props.formatter!(props.value));

    const play = async () => {
        const step = (props.value - props.start!) / props.frequency!;
        const d = dur / props.frequency!;

        let init = props.start!;
        for (let i = 0; i < props.frequency!; i++) {
            await sleep(d);
            init += step;
            setValue(props.formatter!(init));
        }
    };

    onMount(() => play());

    createEffect(() => {
        props.frequency;
        props.value;
        props.start;
        play();
    });

    return <div class={joinClass(props.palette, styles.counter, props.class)} ref={el => {
        dur = transitionDuration(el); // 当前对象的主题可能与全局的不一样。

        if (props.ref) {
            props.ref({
                element() { return el; },
                play() { play(); },
            });
        }
    }}>{value()}</div>;
}
