// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { Scheme } from '@/components/base';

export interface Props {
    /**
     * 组件的颜色，默认采用 error
     */
    scheme?: Scheme;

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
    scheme: 'error',
};

/**
 * 显示错误信息的组件
 */
export default function XError(props: Props) {
    props = mergeProps(defaultProps, props);

    return <div class={`error-page scheme--${props.scheme}`}>
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
