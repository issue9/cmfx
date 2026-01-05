// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { A } from '@solidjs/router';
import { JSX, ParentProps, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { BaseProps, joinClass, RefProps } from '@/base';
import styles from './style.module.css';

export interface Ref {
    /**
     * 组件根元素
     */
    root(): HTMLElement;
}

export interface Props extends BaseProps, ParentProps, RefProps<Ref> {
    /**
     * 首部的 LOGO 图片
     *
     * @reactive
     */
    logo?: string;

    /**
     * 首部的标题
     *
     * @reactive
     */
    title?: string;

    /**
     * 首部的链接
     *
     * @remarks
     * 如果提供了 href，则 {@link title} 和 {@link logo} 将被渲染为一个链接内的元素。
     *
     * @reactive
     */
    href?: string;

    /**
     * 尾部的按钮列表
     *
     * @reactive
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
    return <header role="toolbar" class={joinClass(props.palette, styles.appbar, props.class)} style={props.style}
        ref={el=>{
            if (props.ref) {
                props.ref({
                    root() { return el; }
                });
            }
        }}
    >
        <Show when={props.logo || props.title}>
            <Dynamic class={styles.title} component={props.href ? A : 'div'} href={props.href}>
                <Show when={props.logo}>
                    {c => <img alt="LOGO" class={styles.logo} src={c()} />}
                </Show>
                <Show when={props.title}>
                    {c => <h1 class={styles.name}>{c()}</h1>}
                </Show>
            </Dynamic>
        </Show>

        <Show when={props.children}>
            {c => <div class={styles.main}>{c()}</div>}
        </Show>

        <Show when={props.actions}>
            {c => <div class={styles.actions}>{c()}</div>}
        </Show>
    </header>;
}
