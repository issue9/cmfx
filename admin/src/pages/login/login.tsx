// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Navigate, useNavigate } from '@solidjs/router';
import { createEffect, JSX, Match, Switch } from 'solid-js';

import { useApp, useOptions } from '@/app/context';
import { Button, ObjectAccessor, Password, TextField } from '@/components';
import { Account } from '@/core';

/**
 * 登录页面
 */
export default function (): JSX.Element {
    const ctx = useApp();
    const opt = useOptions();

    return <Switch>
        <Match when={ctx.isLogin()}><Navigate href={opt.routes.private.home} /></Match>
        <Match when={!ctx.isLogin()}><Login /></Match>
    </Switch>;
}

export function Login(): JSX.Element {
    const ctx = useApp();
    const opt = useOptions();
    const nav = useNavigate();

    const f = new ObjectAccessor<Account>({ username: '', password: '' });
    const onReset = () => { f.reset(); };
    const onSubmit = async() => {
        const ret = await ctx.login(f.object());
        if (ret === true) {
            nav(opt.routes.private.home);
            return;
        }

        if (ret) {
            await ctx.notify(ret.type, ret.title);
        }
    };

    createEffect(() => {
        ctx.title = ctx.t('_i.login.title')!;
    });

    return <div class="p--login palette--primary">
        <form onReset={onReset} onSubmit={onSubmit}>
            <p class="text-lg">{ctx.t('_i.login.title')}</p>
            <TextField prefix={<span class="c--icon">person</span>}
                placeholder={ctx.t('_i.login.username')} accessor={f.accessor('username', true)} />
            <Password icon='lock' placeholder={ctx.t('_i.login.password')} accessor={f.accessor('password', true)} />
            <Button disabled={f.accessor('username').getValue() == ''} type="submit">{ctx.t('_i.ok')}</Button>
            <Button type="reset">{ ctx.t('_i.reset') }</Button>
        </form>
    </div>;
}
