// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, JSX, ParentProps, Show, splitProps } from 'solid-js';

import { BackTop } from '@/components/backtop';
import { BaseProps } from '@/components/base';
import { useApp } from '@/context';

export interface Props extends BaseProps, ParentProps {
    /**
     * 指定页面标题，可以是翻译 ID
     */
    title: string;

    /**
     * 是否禁止内置的 BackTop 组件。
     */
    disableBacktop?: boolean;

    class?: string;
    classList?: JSX.CustomAttributes<HTMLElement>['classList'];
    style?: JSX.HTMLAttributes<HTMLElement>['style'];
}

/**
 * 页面组件
 *
 * 默认是 flex-col 布局。如果有需要，可自行指定 class 进行修改。
 */
export function Page (props: Props): JSX.Element {
    const ctx = useApp();

    createEffect(() => {
        ctx.title = ctx.locale().t(props.title);
    });

    const [_, other] = splitProps(props, ['title', 'children', 'disableBacktop', 'classList', 'palette']);

    return <div {...other} classList={{
        ...props.classList,
        'c--page': true,
        [`palette--${props.palette}`]: !!props.palette,
    }}>
        {props.children}
        <Show when={!props.disableBacktop}>
            <BackTop scroller='main-content' />
        </Show>
    </div>;
}