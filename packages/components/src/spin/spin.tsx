// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps, Show } from 'solid-js';

import { BaseProps, joinClass, RefProps } from '@/base';
import styles from './style.module.css';

export interface Ref {
    element(): HTMLFieldSetElement;
}

export interface Props extends ParentProps, BaseProps, RefProps<Ref> {
    /**
     * 加载状态
     *
     * @reactive
     */
    spinning?: boolean;

    /**
     * 在加载状态下的指示器
     *
     * @reactive
     */
    indicator?: JSX.Element;

    /**
     * 遮罩层的样式
     *
     * @remarks 默认情况下，遮罩层是一个透明全覆盖的元素。
     * 此属性可以修改该元素的样式。
     *
     * @reactive
     */
    overlayClass?: string;
}

/**
 * 加载指示组件
 *
 * @remarks 该组件可以作为任何具有加载状态的组件的容器，包含了 `@container/spin` 容器查询条件。
 */
export function Spin(props: Props) {
    return <fieldset class={joinClass(props.palette, styles.spin, props.class)} ref={el => {
        if (!props.ref) { return; }
        props.ref({ element() { return el; } });
    }}>
        {props.children}
        <Show when={props.spinning}>
            <div class={joinClass(undefined, styles.indicator, props.overlayClass)}>{props.indicator}</div>
        </Show>
    </fieldset>;
}
