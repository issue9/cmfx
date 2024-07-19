// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { ErrorBoundary, For, JSX } from 'solid-js';

import { Button, Drawer, ErrorPage, Item, List } from '@/components';
import { useApp } from './context';

export function Private(props: {children?: JSX.Element}) {
    const ctx = useApp();

    if (!ctx.user()) {
        const nav = useNavigate();
        nav(ctx.options.routes.public.home);
        return;
    }

    const aside = <div>
        <List>
            <For each={ctx.options.menus}>
                {(item) => (
                    <Item to={item.key} head={item.icon} text={ctx.t(item.title as any) as string} />
                )}
            </For>
        </List>
    </div>;

    return <Drawer aside={aside} palette='secondary' visible={true}>
        <ErrorBoundary fallback={(err)=>(
            <ErrorPage header={ctx.t('_internal.error.unknownError')} title={err.toString()}>
                <Button palette='primary' onClick={()=>window.location.reload()}>{ctx.t('_internal.refresh')}</Button>
            </ErrorPage>
        )}>
            {props.children}
        </ErrorBoundary>
    </Drawer>;
}
