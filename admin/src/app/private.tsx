// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Navigate } from '@solidjs/router';
import { ErrorBoundary, JSX, Match, Switch } from 'solid-js';

import { Button, Drawer, Error } from '@/components';
import { useInternal } from './context';

export function Private(props: {children?: JSX.Element}) {
    const ctx = useInternal();

    const aside = <div>

    </div>;

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
                {aside}
            </Drawer>
        </Match>
    </Switch>;
}
