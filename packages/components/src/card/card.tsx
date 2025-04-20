// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps, Show } from 'solid-js';

import { BaseProps } from '@components/base';

export interface Props extends BaseProps, ParentProps {
    /**
     * 卡版的标题部分
     */
    header?: JSX.Element;

    /**
     * 自定义的 CSS 类
     */
    class?: string;
}

/**
 * 简单的卡片组件
 */
export function Card(props: Props): JSX.Element {
    return <div class={'c--card ' + (props.class ?? '') + ' ' +(props.palette ? `palette--${props.palette}` : '')}>
        <Show when={props.header}>
            <div class="header">{ props.header }</div>
        </Show>

        <div class="desc">
            { props.children }
        </div>
    </div>;
}
