// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { BaseProps } from '@/base';
import { use } from '@/context';

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

    /**
     * 指定一些自定义的操作
     */
    children?: JSX.Element;
}

const presetProps: Readonly<Partial<Props>> = {
    palette: 'error',
};

/**
 * 显示错误信息的组件
 */
export  function Error(props: Props) {
    props = mergeProps(presetProps, props);
    const [, act] = use();
    act.title = props.header ?? '';

    return <div class={props.palette ? `c--error palette--${props.palette}` : 'c--error'}>
        <Show when={props.header}>
            <h1>{props.header}</h1>
        </Show>

        <Show when={props.title}>
            <p class="title">{props.title}</p>
        </Show>

        <Show when={props.detail}>
            <p class="detail">{props.detail}</p>
        </Show>

        <Show when={props.children}>
            <div class="content">{props.children}</div>
        </Show>
    </div>;
}
