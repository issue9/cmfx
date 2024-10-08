// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Navigate, useNavigate } from '@solidjs/router';
import { JSX, Match, Switch } from 'solid-js';

import { useApp, useOptions } from '@/app/context';
import { Button, Icon, ObjectAccessor, Page, Password, TextField } from '@/components';
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

        if (ret && ret.status !== 401) {
            await ctx.notify(ret.type, ret.title);
        }
    };

    return <Page title="_i.page.current.title" class="p--login palette--primary">
        <form onReset={onReset} onSubmit={onSubmit}>
            <p class="text-lg">{ctx.locale().t('_i.page.current.title')}</p>
            <TextField prefix={<Icon class="!py-0 !px-1 flex items-center" icon='person' />}
                placeholder={ctx.locale().t('_i.page.current.username')} accessor={f.accessor('username', true)} />
            <Password icon='password_2' placeholder={ctx.locale().t('_i.page.current.password')} accessor={f.accessor('password', true)} />
            <Button disabled={f.accessor('username').getValue() == ''} type="submit">{ctx.locale().t('_i.ok')}</Button>
            <Button type="reset">{ ctx.locale().t('_i.reset') }</Button>
        </form>
    </Page>;
}
