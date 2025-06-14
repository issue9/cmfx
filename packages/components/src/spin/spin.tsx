// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps, Show, splitProps } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import styles from './style.module.css';

export interface Props extends ParentProps, JSX.AriaAttributes, BaseProps {
    /**
     * 加载状态
     *
     * 该状态下会禁用所有的子组件。
     */
    spinning?: boolean;

    /**
     * 在加载状态下的指示器
     */
    indicator?: JSX.Element;

    class?: string;
}

/**
 * 加载指示组件
 *
 * 访组件可以作为任何具有加载状态的组件的容器
 */
export function Spin(props: Props) {
    const [_, contProps] = splitProps(props, ['spinning', 'indicator', 'palette', 'class']);
    return <fieldset {...contProps} disabled={props.spinning}
        class={joinClass(props.class, styles.spin, props.palette ? `palette--${props.palette}` : undefined)}>
        {props.children}

        <Show when={props.spinning}>
            <div class={styles.indicator}>{props.indicator}</div>
        </Show>
    </fieldset>;
}