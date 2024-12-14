// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, JSX, ParentProps, Show, splitProps } from 'solid-js';

import { useApp } from '@/components/context';
import { BackTop } from '@/components/backtop';
import { BaseProps } from '@/components/base';

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
export function Page (props: Props) {
    const ctx = useApp();

    createEffect(() => {
        ctx.title = ctx.locale().t(props.title);
    });

    // 计算 class
    const [_, other] = splitProps(props, ['title', 'children']);
    if ('classList' in other) {
        other['classList'] = { ...other['classList'], 'c--page':true};
    } else {
        other['classList'] = { 'c--page': true };
    }

    return <div {...other}>
        {props.children}
        <Show when={!props.disableBacktop}>
            <BackTop scroller='main-content' />
        </Show>
    </div>;
}