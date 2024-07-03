// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { mergeProps, Show } from 'solid-js';

import { useApp } from '@/app';
import { Color } from '@/components/base';

export interface Props {
    /**
     * 组件的颜色，默认采用 error
     */
    color?: Color;

    /**
     * 按钮的颜色，默认为 primary
     */
    buttonColor?: Color;

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
     * 首页的链接，有此值会显示返回首页的链接。
     */
    home?: string;
}

const defaultProps: Partial<Props> = {
    color: 'error',
    buttonColor: 'primary'
};

/**
 * 显示错误信息的组件
 */
export default function XError(props: Props) {
    props = mergeProps(defaultProps, props);

    const ctx = useApp();

    return <div class={`error-page scheme--${props.color}`}>
        <Show when={props.header}>
            <h1>{props.header}</h1>
        </Show>

        <Show when={props.title}>
            <p class="title">{props.title}</p>
        </Show>

        <Show when={props.detail}>
            <p class="detail">{props.detail}</p>
        </Show>

        <Show when={props.home}>
            <a class={`button--filled scheme--${props.buttonColor}`} href={props.home}>{ctx.t('_internal.error.backHome')}</a>
        </Show>
    </div>;
}
