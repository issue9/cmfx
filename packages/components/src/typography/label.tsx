// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, ParentProps, Show, ValidComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { BaseProps, joinClass } from '@/base';
import styles from './style.module.css';

export interface Props extends BaseProps, ParentProps {
    /**
     * 图标
     *
     * @reactive
     */
    icon?: JSX.Element;

    /**
     * 标签，默认为 p
     */
    tag?: ValidComponent;
}

const presetProps: Readonly<Partial<Props>> = {
    tag: 'p',
} as const;

export function Label(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    return <Dynamic component={props.tag} class={joinClass(props.palette, styles.label, props.class)} style={props.style}>
        <Show when={props.icon}>{c => { return c(); }}</Show>
        {props.children}
    </Dynamic>;
}
