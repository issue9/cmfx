// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, JSX, ParentProps, Show, splitProps } from 'solid-js';

import { BackTop } from '@/backtop';
import { BaseProps, joinClass } from '@/base';
import { use, useLocale } from '@/context';
import styles from './style.module.css';

export interface Props extends BaseProps, ParentProps {
    /**
     * 指定页面标题，可以是翻译 ID。
     */
    title: string;

    /**
     * 是否禁止内置的 BackTop 组件
     */
    disableBacktop?: boolean;
}

/**
 * 页面组件
 *
 * 默认是 flex-col 布局。如果有需要，可自行指定 class 进行修改。
 */
export function Page (props: Props): JSX.Element {
    const [, act] = use();
    const l = useLocale();
    const [_, other] = splitProps(props, ['title', 'children', 'disableBacktop', 'class', 'palette']);

    createEffect(() => { act.setTitle(l.t(props.title)); });

    return <div {...other} class={joinClass(styles.page, props.palette ? `palette--${props.palette}` : '', props.class)}>
        {props.children}
        <Show when={!props.disableBacktop}><BackTop /></Show>
    </div>;
}
