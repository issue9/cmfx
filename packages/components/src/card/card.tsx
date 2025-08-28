// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps, Show } from 'solid-js';

import { BaseProps, classList, joinClass } from '@/base';
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
    return <div class={classList({[`palette--${props.palette}`]: !!props.palette}, styles.card, props.class)}>
        <Show when={props.header}>
            <header class={joinClass(styles.header, props.headerClass)}>{props.header}</header>
        </Show>

        <main class={joinClass(styles.main, props.mainClass)}>
            {props.children}
        </main>

        <Show when={props.footer}>
            <footer class={joinClass(styles.footer, props.footerClass)}>{props.footer}</footer>
        </Show>
    </div>;
}
