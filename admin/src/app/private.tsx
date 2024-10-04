// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Navigate } from '@solidjs/router';
import {
    Accessor, createEffect, createMemo, ErrorBoundary,
    Match, ParentProps, Setter, Switch
} from 'solid-js';

import { Drawer, Item, Label, List } from '@/components';
import { Breakpoint, compareBreakpoint, Locale } from '@/core';
import { useApp, useOptions } from './context';
import * as errors from './errors';
import { MenuItem } from './options/route';

export const floatAsideWidth: Breakpoint = 'sm';

interface Props extends ParentProps {
    menuVisibleGetter: Accessor<boolean>;
    menuVisibleSetter: Setter<boolean>;
}

export function Private(props: Props) {
    const ctx = useApp();
    const opt = useOptions();
    const floating = createMemo(() => compareBreakpoint(ctx.breakpoint(), floatAsideWidth) < 0);
    createEffect(() => {
        if (!floating()) {
            props.menuVisibleSetter(true);
        }
    });

    return <Switch>
        <Match when={!ctx.isLogin()}>
            <Navigate href={/*@once*/opt.routes.public.home} />
        </Match>
        <Match when={ctx.isLogin()}>
            <Drawer floating={floating()} palette='secondary'
                close={()=>props.menuVisibleSetter(false)}
                visible={props.menuVisibleGetter()}
                main={
                    <ErrorBoundary fallback={err=>errors.Unknown(err)}>{props.children}</ErrorBoundary>
                }>
                <List anchor>{buildItems(ctx.locale(), opt.menus)}</List>
            </Drawer>
        </Match>
    </Switch>;
}

export function buildItems(l: Locale, menus: Array<MenuItem>) {
    const items: Array<Item> = [];
    menus.forEach((mi) => {
        switch (mi.type) {
        case 'divider':
            items.push({ type: 'divider' });
            break;
        case 'group':
            items.push({
                type: 'group',
                label: l.t(mi.label),
                items: buildItems(l, mi.items)
            });
            break;
        case 'item':
            const i: Item = {
                type: 'item',
                label: <Label icon={mi.icon}>{l.t(mi.label)}</Label>,
                accesskey: mi.accesskey,
                value: mi.path
            };
            if (mi.items) {
                i.items = buildItems(l, mi.items);
            }

            items.push(i);
            break;
        }
    });

    return items;
}
