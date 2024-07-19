// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { BaseProps } from '@/components/base';

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

    children?: JSX.Element;
}

const defaultProps: Partial<Props> = {
    palette: 'error',
};

/**
 * 显示错误信息的组件
 */
export default function(props: Props) {
    props = mergeProps(defaultProps, props);

    return <div class={props.palette ? `error-page palette--${props.palette}` : 'error-page'}>
        <Show when={props.header}>
            <h1>{props.header}</h1>
        </Show>

        <Show when={props.title}>
            <p class="title">{props.title}</p>
        </Show>

        <Show when={props.detail}>
            <p class="detail">{props.detail}</p>
        </Show>

        {props.children}
    </div>;
}
