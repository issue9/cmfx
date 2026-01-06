// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps, Show } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import { Label } from '@/label';
import styles from './style.module.css';

export interface Props extends BaseProps, ParentProps {
    /**
     * 图标
     *
     * @reactive
     */
    icon?: JSX.Element;

    /**
     * 标题
     *
     * @reactive
     */
    title?: string;
}

/**
 * 一长段内容的描述信息，可带一个标题。
 */
export function Description(props: Props): JSX.Element {
    return <div class={joinClass(props.palette, styles.description, props.class)} style={props.style}>
        <Show when={props.icon || props.title}>
            <Label icon={props.icon}>{props.title}</Label>
        </Show>
        <div class={styles.desc}>
            {props.children}
        </div>
    </div>;
}
