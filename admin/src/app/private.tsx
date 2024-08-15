// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Navigate } from '@solidjs/router';
import { Accessor, createEffect, createMemo, ErrorBoundary, Match, ParentProps, Setter, Show, Switch } from 'solid-js';

import { Drawer, Item, List } from '@/components';
import { Breakpoint, Breakpoints } from '@/core';
import { T, useInternal } from './context';
import * as errors from './errors';
import { MenuItem } from './options/route';

export const floatAsideWidth: Breakpoint = 'sm';

interface Props extends ParentProps {
    menuVisibleGetter: Accessor<boolean>;
    menuVisibleSetter: Setter<boolean>;
}

export function Private(props: Props) {
    const ctx = useInternal();
    const floating = createMemo(() => Breakpoints.compare(ctx.breakpoint(), floatAsideWidth) < 0);
    createEffect(() => {
        if (!floating()) {
            props.menuVisibleSetter(true);
        }
    });

    return <Switch>
        <Match when={!ctx.isLogin()}>
            <Navigate href={/*@once*/ctx.options.routes.public.home} />
        </Match>
        <Match when={ctx.isLogin()}>
            <Drawer floating={floating()} palette='secondary'
                close={()=>props.menuVisibleSetter(false)}
                visible={props.menuVisibleGetter()}
                main={
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
