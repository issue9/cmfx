// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import { use } from '@/context';
import styles from './style.module.css';

export interface Props extends BaseProps {
    /**
     *标题
     */
    header?: string;

    /**
     * 简要说明
     */
    title?: string;

    /**
     * 错误的详细描述
     */
    detail?: string;

    /**
     * 指定一些自定义的操作
     */
    children?: JSX.Element;
}

const presetProps: Readonly<Partial<Props>> = {
    palette: 'error',
};

/**
 * 显示错误信息的组件
 */
export  function Error(props: Props) {
    props = mergeProps(presetProps, props);
    const [, act] = use();
    act.setTitle(props.header ?? '');

    return <div class={joinClass(styles.error, props.palette ? `palette--${props.palette}` : undefined)}>
        <Show when={props.header}>
            <h1>{props.header}</h1>
        </Show>

        <Show when={props.title}>
            <p class={styles.title}>{props.title}</p>
        </Show>

        <Show when={props.detail}>
            <p class={styles.detail}>{props.detail}</p>
        </Show>

        <Show when={props.children}>
            <div class={styles.content}>{props.children}</div>
        </Show>
    </div>;
}
