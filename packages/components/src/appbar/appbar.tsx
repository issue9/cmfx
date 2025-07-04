// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps, Show } from 'solid-js';

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
     * 尾部的按钮列表
     */
    actions?: JSX.Element;

    class?: string;
}

/**
 * 应用顶部的工具栏
 *
 * 组件分成了以下几部分
 *  | logo title    children                       actions |
 */
export default function Appbar(props: Props): JSX.Element {
    return <header role="toolbar" class={joinClass(styles.appbar, props.palette ? `palette--${props.palette}` : undefined, props.class)}>
        <div class={styles.title}>
            <Show when={props.logo}>
                <img alt="LOGO" class={styles.logo} src={props.logo} />
            </Show>
            <h1 class={styles.name}>{props.title}</h1>
        </div>

        <div class={styles.main}>{props.children}</div>

        <div class={styles.actions}>{props.actions}</div>
    </header>;
}
