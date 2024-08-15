// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Navigate } from '@solidjs/router';
import { createSignal, ErrorBoundary, JSX, Match, Show, Switch } from 'solid-js';

import { Drawer, Item, List } from '@/components';
import { Breakpoints } from '@/core';
import { T, useInternal } from './context';
import * as errors from './errors';
import { MenuItem } from './options/route';

export function Private(props: {children?: JSX.Element}) {
    const ctx = useInternal();
    const [visible, setVisible] = createSignal(true);

    return <Switch>
        <Match when={!ctx.isLogin()}>
            <Navigate href={ctx.options.routes.public.home} />
        </Match>
        <Match when={ctx.isLogin()}>
            <Drawer floating={Breakpoints.compare(ctx.breakpoint(), 'sm')<0} close={()=>setVisible(false)} palette='secondary' visible={visible()} main={
                <ErrorBoundary fallback={err=>errors.Unknown(err)}>{props.children}</ErrorBoundary>
            }>
                <List anchor>{buildItems(ctx.t, ctx.options.menus)}</List>
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
                label: <span class="c--icon-container">
                    <Show when={mi.icon}>
                        <span class="c--icon">{mi.icon}</span>
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
