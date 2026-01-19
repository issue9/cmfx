// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, ParentProps, Show, ValidComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { BaseProps, joinClass } from '@components/base';
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

/**
 * 带图标的标题
 */
export function Label(props: Props): JSX.Element {
    props = mergeProps({ tag: 'p' }, props);

    return <Dynamic component={props.tag} class={joinClass(props.palette, styles.label, props.class)} style={props.style}>
        <Show when={props.icon}>{c => { return c(); }}</Show>
        {props.children}
    </Dynamic>;
}
