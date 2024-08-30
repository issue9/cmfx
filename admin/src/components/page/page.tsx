// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, ParentProps } from 'solid-js';

import { useApp } from '@/app/context';
import { BaseProps } from '@/components/base';

export interface Props extends BaseProps, ParentProps {
    /**
     * 指定页面标题，可以是翻译 ID
     */
    title: string;
}

/**
 * 页面组件
 */
export default function(props: Props) {
    const ctx = useApp();

    createEffect(() => {
        ctx.title = ctx.t(props.title as any);
    });

    return <div class="p-4 pt-6">
        {props.children}
    </div>;
}
