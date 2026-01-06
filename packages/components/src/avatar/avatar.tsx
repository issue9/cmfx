// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, JSX, Match, Show, Switch } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import styles from './style.module.css';

export interface Props extends BaseProps {
    /**
     * 是否圆角
     *
     * @reactive
     */
    rounded?: boolean;

    /**
     * 图片地址
     *
     * @reactive
     */
    value: string;

    /**
     * 备用的显示内容
     *
     * @reactive
     */
    fallback?: JSX.Element;

    /**
     * 懒加载
     *
     * @reactive
     */
    lazy?: boolean;

    /**
     * 鼠标悬停时显示的内容
     *
     * @reactive
     */
    hover?: JSX.Element;

    /**
     * 点击事件
     */
    onclick?: JSX.EventHandler<HTMLDivElement, MouseEvent>;
}

/**
 * 头像组件
 */
export default function Avatar(props: Props): JSX.Element {
    const [error, setError] = createSignal(false);

    createEffect(() => {
        if (props.value) { setError(false); }
    });

    return <div class={joinClass(props.palette, styles.avatar, props.rounded ? styles.rounded : '', props.class)}
        style={props.style} onclick={props.onclick}
    >
        <Switch fallback={
            <img onerror={() => setError(true)} src={props.value} alt='avatar' loading={props.lazy ? 'lazy' : 'eager'} />
        }>
            <Match when={error()}>
                <div class={styles.fallback}>{props.fallback}</div>
            </Match>
        </Switch>

        <Show when={props.hover}>
            <div class={joinClass(undefined, styles.hover)}>{props.hover}</div>
        </Show>
    </div>;
}
