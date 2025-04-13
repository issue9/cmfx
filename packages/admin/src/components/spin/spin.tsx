// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps, Show, splitProps } from 'solid-js';

import { BaseProps } from '@/components/base';

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
    const [_, contProps] = splitProps(props, ['spinning', 'indicator', 'palette']);
    return <fieldset {...contProps} classList={{ // NOTE: classList 必须在 class 属性之后设置，否则不会启作用！
        'c--spin': true,
        [`palette--${props.palette}`]: !!props.palette,
    }} disabled={props.spinning}>
        {props.children}

        <Show when={props.indicator}>
            <div class="indicator">{props.indicator}</div>
        </Show>
    </fieldset>;
}