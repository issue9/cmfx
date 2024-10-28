// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, JSX, ParentProps, splitProps } from 'solid-js';

import { useApp } from '@/app/context';
import { BaseProps } from '@/components/base';

export interface Props extends BaseProps, ParentProps {
    /**
     * 指定页面标题，可以是翻译 ID
     */
    title: string;

    class?: string;

    classList?: JSX.CustomAttributes<HTMLElement>['classList'];

    style?: JSX.HTMLAttributes<HTMLElement>['style'];
}

/**
 * 页面组件
 *
 * 默认是 flex-col 布局。如果有需要，可自行指定 class 进行修改。
 */
export default function (props: Props) {
    const ctx = useApp();

    createEffect(() => {
        ctx.title = ctx.locale().t(props.title);
    });

    const [_, other] = splitProps(props, ['title', 'children']);
    if ('classList' in other) {
        other['classList'] = { ...other['classList'], 'c--page':true};
    } else {
        other['classList'] = { 'c--page': true };
    }

    return <div {...other}>
        {props.children}
    </div>;
}
