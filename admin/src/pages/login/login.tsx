// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { JSX } from 'solid-js';

import { useApp } from '@/app';
import { FormAccessor, TextField } from '@/components';
import { Account } from '@/core';

export default function(): JSX.Element {
    const ctx = useApp();

    if (ctx.user()) { // 已经登录
        const nav = useNavigate();
        nav(ctx.options.routes.private.home);
        return;
    }

    const f = new FormAccessor<Account>({username:'',password:''});

    return <form {...f.events(ctx.fetcher(), 'POST', '/login')} class="items-center flex justify-center flex-col gap-2">
        <p>{ctx.t('_internal.login.title')}</p>
        <TextField icon="face" palette='secondary' placeholder='username !' label="账号" accessor={f.accessor('username')} />
        <TextField label="密码" accessor={f.accessor('password')} />
        <button class="button--filled-secondary" type="reset">reset</button>
        <button disabled={f.accessor('username').getValue()==''} type="submit" class="button--filled-primary">{ctx.t('_internal.ok') as string}</button>
    </form>;
}
