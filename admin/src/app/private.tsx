// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { A, useNavigate } from '@solidjs/router';
import { ErrorBoundary, For, JSX } from 'solid-js';

import { XError } from '@/components';
import { useApp } from './context';

export function Private(props: {children?: JSX.Element}) {
    const ctx = useApp();

    if (!ctx.user()) {
        const nav = useNavigate();
        nav(ctx.options.routes.public.home);
        return;
    }

    return <>
        <aside class="max-w-32 h-full scheme--tertiary bg-tertiary text-tertiary px-4 pb-4">
            <For each={ctx.options.menus}>
                {(item) => (
                    <li>
                        <A href={item.key!}>{ctx.t(item.title as any)}</A>
                    </li>
                )}
            </For>
        </aside>

        <main class="overflow-y-scroll h-full p-4 rounded-lg flex-1">
            <ErrorBoundary fallback={(err)=>(<XError title={err.toString()} />)}>
                {props.children}
            </ErrorBoundary>
        </main>
    </>;
}
