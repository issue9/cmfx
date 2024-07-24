// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { JSX } from 'solid-js';

import { useInternal } from '@/app/context';
import { Button, FormAccessor, Password, TextField } from '@/components';
import { Account } from '@/core';

export default function(): JSX.Element {
    const ctx = useInternal();

    if (ctx.user().id) { // 已经登录
        const nav = useNavigate();
        nav(ctx.options.routes.private.home);
        return;
    }

    const f = new FormAccessor<Account>({ username: '', password: '' });

    return <div class="flex justify-center h-full palette--primary">
        <form {...f.events(ctx.fetcher(), 'POST', '/login')} class="flex justify-center flex-col gap-2 w-full sm:w-80">
            <p>{ctx.t('_internal.login.title')}</p>
            <TextField prefix={<span class="material-symbols-outlined">person</span>} placeholder={ctx.t('_internal.login.username')}  accessor={f.accessor('username')} />
            <Password icon='lock' placeholder={ctx.t('_internal.login.password')} accessor={f.accessor('password')} />
            <Button type="reset">reset</Button>
            <Button disabled={f.accessor('username').getValue() == ''} type="submit">{ctx.t('_internal.ok') as string}</Button>
        </form>
    </div>;
}
