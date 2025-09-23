// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { A } from '@solidjs/router';
import { JSX, ParentProps, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { BaseProps, joinClass } from '@/base';
import styles from './style.module.css';

export interface Props extends BaseProps, ParentProps {
    /**
     * 首部的 LOGO 图片
     */
    logo?: string;

    /**
     * 首部的标题
     */
    title: string;

    /**
     * 首部的链接
     *
     * @remarks 如果提供了 href，则 {@link title} 和 {@link logo} 将被渲染为一个链接内的元素。
     */
    href?: string;

    /**
     * 尾部的按钮列表
     */
    actions?: JSX.Element;
}

/**
 * 应用顶部的工具栏
 *
 * @remarks 组件分成了以下几部分：
 * ```
 *  | logo title    children                       actions |
 * ```
 */
export default function Appbar(props: Props): JSX.Element {
    return <header role="toolbar" class={joinClass(props.palette, styles.appbar, props.class)}>
        <Dynamic class={styles.title} component={props.href ? A : 'div'} href={props.href}>
            <Show when={props.logo}>
                <img alt="LOGO" class={styles.logo} src={props.logo} />
            </Show>
            <h1 class={styles.name}>{props.title}</h1>
        </Dynamic>

        <div class={styles.main}>{props.children}</div>

        <div class={styles.actions}>{props.actions}</div>
    </header>;
}
