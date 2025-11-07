// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For, JSX, mergeProps } from 'solid-js';

import { BaseProps, joinClass, RefProps } from '@/base';
import styles from './style.module.css';

export interface Ref {
    /**
     * 组件的根元素
     */
    element(): HTMLElement;

    /**
     * 重新计算导航内容
     */
    refresh(): void;
}

export interface Props extends BaseProps, RefProps<Ref> {
    /**
     * 用于生成目录的元素
     *
     * @remarks 只从当前元素以及子元素中提取 h 系列元素。
     */
    target: HTMLElement;

    /**
     * 用于查询目录项的 css selector 表达式
     *
     * @defaultValue `h1,h2,h3,h4,h5,h6`
     */
    query?: string;
}

const queryString = 'h1,h2,h3,h4,h5,h6';

/**
 * 根据 h1-h6 元素生成导航内容
 */
export default function Nav(props: Props): JSX.Element {
    props = mergeProps({ query: queryString }, props);

    const [headings, setHeadings] = createSignal(props.target.querySelectorAll(props.query!));

    const refresh = (): void => {
        setHeadings(props.target.querySelectorAll(props.query!));
    };

    return <nav class={joinClass(props.palette, styles.nav, props.class)} style={props.style} ref={el => {
        if (!props.ref) { return; }
        props.ref({
            element() { return el; },
            refresh() { refresh(); }
        });
    }}>
        <For each={Array.from(headings())}>
            {h =>
                <p class={styles[h.tagName.toLowerCase()]} onclick={() => {
                    h.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }}>{h.textContent}</p>
            }
        </For>
    </nav>;
}
