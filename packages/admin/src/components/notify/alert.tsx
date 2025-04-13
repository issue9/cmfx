// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { JSX, onMount, Show } from 'solid-js';

import { BaseProps } from '@/components/base';
import { Icon } from '@/components/icon';
import { Theme } from '@/core';
import { createTimer } from './timer';

export interface Props extends BaseProps {
    title: string;
    body?: string;
    id: string;
    timeout?: number; // 单位为秒
    del: { (id: string): void; };
}

export function Alert(props: Props): JSX.Element {
    let ref: HTMLDivElement;
    let wrapRef: HTMLDivElement;

    const del = async () => {
        ref.style.height = '0px'; // 触发 CSS 动画
        await sleep(Theme.transitionDuration(300)); // 等待动画完成才真正地从 DOM 中删除节点
        props.del(props.id);
    };

    onMount(() => {
        if (props.timeout) {
            const timeout = props.timeout * 1000;
            let timer = createTimer(del, timeout, 100, (t: number) => {
                const p = (timeout - t) / timeout * 100;
                wrapRef.style.background = `conic-gradient(var(--bg-low) 0% ${p}%, var(--bg-high) ${p}% 100%)`;
            });

            ref.addEventListener('mouseover', () => {
                timer.pause();
            });

            ref.addEventListener('mouseout', () => {
                timer.start();
            });
        }
    });

    return <div ref={el=>ref=el} id={props.id} role="alert" classList={{
        'message': true,
        [`palette--${props.palette}`]: !!props.palette,
    }}>
        <div class="title">
            <p>{props.title}</p>
            <div class="close-wrap" ref={el=>wrapRef=el}>
                <Icon onClick={del} class="close" icon="close" />
            </div>
        </div>
        <Show when={props.body}>
            <hr />
            <p class="p-3">{props.body}</p>
        </Show>
    </div>;
}
