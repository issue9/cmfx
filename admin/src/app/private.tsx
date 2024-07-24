// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { ErrorBoundary, For, JSX } from 'solid-js';

import { Button, Drawer, Error, Item, List } from '@/components';
import { useInternal } from './context';

export function Private(props: {children?: JSX.Element}) {
    const ctx = useInternal();

    if (!ctx.user().id) {
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

    return <Drawer palette='secondary' visible={true} main={
        <ErrorBoundary fallback={(err)=>(
            <Error header={ctx.t('_internal.error.unknownError')} title={err.toString()}>
                <Button palette='primary' onClick={()=>window.location.reload()}>{ctx.t('_internal.refresh')}</Button>
            </Error>
        )}>
            {props.children}
        </ErrorBoundary>
    }>
        {aside}
    </Drawer>;
}
