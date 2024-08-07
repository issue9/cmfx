// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Navigate } from '@solidjs/router';
import { ErrorBoundary, JSX, Match, Show, Switch } from 'solid-js';

import { Button, Drawer, Error, Item, List } from '@/components';
import { T, useInternal } from './context';
import { MenuItem } from './options/page';

export function Private(props: {children?: JSX.Element}) {
    const ctx = useInternal();

    return <Switch>
        <Match when={!ctx.user()?.id}>
            <Navigate href={ctx.options.routes.public.home} />
        </Match>
        <Match when={ctx.user()?.id}>
            <Drawer palette='secondary' visible={true} main={
                <ErrorBoundary fallback={(err) => (
                    <Error header={ctx.t('_internal.error.unknownError')} title={err.toString()}>
                        <Button palette='primary' onClick={() => window.location.reload()}>{ctx.t('_internal.refresh')}</Button>
                    </Error>
                )}>
                    {props.children}
                </ErrorBoundary>
            }>
                <List anchor>
                    {buildItems(ctx.t, ctx.options.menus)}
                </List>
            </Drawer>
        </Match>
    </Switch>;
}

function buildItems(t: T, menus: Array<MenuItem>) {
    const items: Array<Item> = [];
    menus.forEach((mi) => {
        switch (mi.type) {
        case 'divider':
            items.push({ type: 'divider' });
            break;
        case 'group':
            items.push({
                type: 'group',
                label: t(mi.label as any)!,
                items: buildItems(t, mi.items)
            });
            break;
        case 'item':
            const i: Item = {
                type: 'item',
                label: <span class="icon-container">
                    <Show when={mi.icon}>
                        <span class="material-symbols-outlined">{mi.icon}</span>
                    </Show>
                    {t(mi.label as any) as string}
                </span>,
                accesskey: mi.accesskey,
                value: mi.path
            };
            if (mi.items) {
                i.items = buildItems(t, mi.items);
            }

            items.push(i);
            break;
        }
    });

    return items;
}
