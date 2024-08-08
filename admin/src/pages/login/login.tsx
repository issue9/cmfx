// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Navigate, useNavigate } from '@solidjs/router';
import { createEffect, JSX, Match, Switch } from 'solid-js';

import { useInternal } from '@/app/context';
import { Button, ObjectAccessor, Password, TextField } from '@/components';
import { Account } from '@/core';

/**
 * 登录页面
 */
export default function (): JSX.Element {
    const ctx = useInternal();

    return <Switch>
        <Match when={ctx.user()?.id}>
            <Navigate href={ctx.options.routes.private.home} />
        </Match>
        <Match when={!ctx.user()?.id}>
            <Login />
        </Match>
    </Switch>;
}

export function Login(): JSX.Element {
    const ctx = useInternal();
    const nav = useNavigate();

    const f = new ObjectAccessor<Account>({ username: '', password: '' });
    const onReset = () => { f.reset(); };
    const onSubmit = async() => {
        const ret = await ctx.login(f.object());
        if (ret === true) {
            nav(ctx.options.routes.private.home);
            return;
        }

        if (ret) {
            ctx.notify(ret.type, ret.title);
        }
    };

    createEffect(() => {
        ctx.title = ctx.t('_internal.login.title')!;
    });

    return <div class="p--login palette--primary">
        <form onReset={onReset} onSubmit={onSubmit}>
            <p class="text-lg">{ctx.t('_internal.login.title')}</p>
            <TextField prefix={<span class="material-symbols-outlined">person</span>}
                placeholder={ctx.t('_internal.login.username')} accessor={f.accessor('username', true)} />
            <Password icon='lock' placeholder={ctx.t('_internal.login.password')} accessor={f.accessor('password', true)} />
            <Button disabled={f.accessor('username').getValue() == ''} type="submit">{ctx.t('_internal.ok')}</Button>
            <Button type="reset">{ ctx.t('_internal.reset') }</Button>
        </form>
    </div>;
}
