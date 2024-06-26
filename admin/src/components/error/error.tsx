// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Show } from 'solid-js';

import { Color } from '@/components/base';
import { useApp } from '@/pages/app';

export interface Props {
    /**
     * 组件的颜色，默认采用 error
     */
    color?: Color;

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

/**
 * 显示错误信息的组件
 */
export default function XError(props: Props) {
    const ctx = useApp();

    const color = props.color ? props.header+'-color' : 'error-color';
    const btnCls = props.color != 'primary' ? 'primary-button' : 'secondary-button';

    return <div class="p-8 mx-auto w-dvw h-dvh content-center text-center" classList={{[color]:true}}>
        <Show when={props.header}>
            <h1 class="mb-4 text-7xl md:text-9xl tracking-tight font-extrabold">{props.header}</h1>
        </Show>

        <Show when={props.title}>
            <p class="mb-4 tracking-tight font-bold text-3xl md:text-4xl">{props.title}</p>
        </Show>

        <Show when={props.detail}>
            <p class="mb-4 tracking-tight font-bold text-lg">{props.detail}</p>
        </Show>

        <Show when={props.home}>
            <a class={btnCls} href={props.home}>{ctx.t('_internal.error.backHome')}</a>
        </Show>
    </div>;
}
