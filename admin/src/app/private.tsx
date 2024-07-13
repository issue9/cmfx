// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { ErrorBoundary, For, JSX } from 'solid-js';

import { XButton, XDrawer, XError, XItem, XList } from '@/components';
import { useApp } from './context';

export function Private(props: {children?: JSX.Element}) {
    const ctx = useApp();

    if (!ctx.user()) {
        const nav = useNavigate();
        nav(ctx.options.routes.public.home);
        return;
    }

    const aside = <div>
        <XList>
            <For each={ctx.options.menus}>
                {(item) => (
                    <XItem to={item.key} head={item.icon} text={ctx.t(item.title as any) as string} />
                )}
            </For>
        </XList>
    </div>;

    return <XDrawer aside={aside} scheme='secondary' visible={true}>
        <ErrorBoundary fallback={(err)=>(
            <XError header={ctx.t('_internal.error.unknownError')} title={err.toString()}>
                <XButton scheme='primary' onClick={()=>window.location.reload()}>{ctx.t('_internal.refresh')}</XButton>
            </XError>
        )}>
            {props.children}
        </ErrorBoundary>
    </XDrawer>;
}
