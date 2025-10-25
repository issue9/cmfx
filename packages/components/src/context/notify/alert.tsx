// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createTimer, sleep } from '@cmfx/core';
import { JSX, onCleanup, onMount, Show } from 'solid-js';
import IconClose from '~icons/material-symbols/close';

import { BaseProps, joinClass, transitionDuration } from '@/base';
import styles from './style.module.css';

export interface Props extends BaseProps {
    title: string;
    body?: string;
    timeout?: number; // 单位为毫秒
}

/**
 * 警告框
 */
export function Alert(props: Props): JSX.Element {
    let ref: HTMLDivElement;
    let wrapRef: HTMLDivElement;

    const del = async () => {
        ref.style.height = '0';
        sleep(transitionDuration(ref)).then(() => ref.remove());
    };

    onMount(() => {
        const h = ref.getBoundingClientRect().height;
        ref.style.height = `${h}px`; // 只有明确的高度，transition 动画才能触发。

        if (props.timeout) {
            const timeout = props.timeout;
            const timer = createTimer(timeout, -100, (t: number) => {
                const p = (timeout - t) / timeout * 100;
                wrapRef.style.background = `conic-gradient(var(--bg-low) 0% ${p}%, var(--bg-high) ${p}% 100%)`;
                if (t <= 0) { del(); }
            });
            timer.start();

            ref.addEventListener('mouseover', timer.pause);
            ref.addEventListener('mouseout', timer.start);

            onCleanup(() => {
                ref.removeEventListener('mouseover', timer.pause);
                ref.removeEventListener('mouseout', timer.start);
                timer.stop();
            });
        }
    });

    return <div ref={el => ref = el} role="alert"
        class={joinClass(props.palette, styles.message, props.class)}>
        <div class={styles.title}>
            <p>{props.title}</p>
            <div class={styles['close-wrap']} ref={el => wrapRef = el}>
                <IconClose onClick={del} class={styles.close} />
            </div>
        </div>
        <Show when={props.body}>
            {c => <div class={styles.body}><p>{c()}</p></div>}
        </Show>
    </div>;
}
