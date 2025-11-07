// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps, Show } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import styles from './style.module.css';

export interface Props extends BaseProps, ParentProps {
    /**
     * 卡片的标题部分
     */
    header?: JSX.Element;

    /**
     * 为标题容器追加新的 CSS 样式类
     */
    headerClass?: string;

    /**
     * 卡片的页脚部分
     */
    footer?: JSX.Element;

    /**
     * 为页脚容器追加新的 CSS 样式类
     */
    footerClass?: string;

    /**
     * 为内容容器追加新的 CSS 样式类
     */
    mainClass?: string;
}

/**
 * 简单的卡片组件
 */
export function Card(props: Props): JSX.Element {
    return <div class={joinClass(props.palette, styles.card, props.class)} style={props.style}>
        <Show when={props.header}>
            {c => <header class={joinClass(undefined, styles.header, props.headerClass)}>{c()}</header>}
        </Show>

        <main class={joinClass(undefined, styles.main, props.mainClass)}>
            {props.children}
        </main>

        <Show when={props.footer}>
            {c => <footer class={joinClass(undefined, styles.footer, props.footerClass)}>{c()}</footer>}
        </Show>
    </div>;
}
