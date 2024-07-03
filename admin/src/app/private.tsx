// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { A, useNavigate } from '@solidjs/router';
import { ErrorBoundary, For, JSX } from 'solid-js';

import { XDrawer, XError } from '@/components';
import { useApp } from './context';

export function Private(props: {children?: JSX.Element}) {
    const ctx = useApp();

    if (!ctx.user()) {
        const nav = useNavigate();
        nav(ctx.options.routes.public.home);
        return;
    }

    const aside = <>
        <For each={ctx.options.menus}>
            {(item) => (
                <li>
                    <A href={item.key!}>{ctx.t(item.title as any)}</A>
                </li>
            )}
        </For>
    </>;

    return <XDrawer aside={aside}>
        <ErrorBoundary fallback={(err)=>(<XError title={err.toString()} />)}>
            {props.children}
        </ErrorBoundary>
    </XDrawer >;
}
