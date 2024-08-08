// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Navigate } from '@solidjs/router';
import { ErrorBoundary, JSX, Match, Show, Switch } from 'solid-js';

import { Drawer, Item, List } from '@/components';
import { T, useInternal } from './context';
import * as errors from './errors';
import { MenuItem } from './options/route';

export function Private(props: {children?: JSX.Element}) {
    const ctx = useInternal();

    return <Switch>
        <Match when={!ctx.user()?.id}>
            <Navigate href={ctx.options.routes.public.home} />
        </Match>
        <Match when={ctx.user()?.id}>
            <Drawer palette='secondary' visible={true} main={
                <ErrorBoundary fallback={err=>errors.Unknown(err)}>{props.children}</ErrorBoundary>
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
                label: t(mi.label as any) ?? mi.label,
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
                    {t(mi.label as any) ?? mi.label}
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
