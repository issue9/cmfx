// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { JSX } from 'solid-js';

import { useInternal } from '@/app/context';
import { Button, FormAccessor, Password, TextField } from '@/components';
import { Account } from '@/core';

/**
 * 登录页面
 */
export default function(): JSX.Element {
    const ctx = useInternal();
    ctx.title = ctx.t('_internal.login.title') as string;
    const nav = useNavigate();

    if (ctx.user().id) { // 已经登录
        nav(ctx.options.routes.private.home);
        return;
    }

    const f = new FormAccessor<Account>(
        { username: '', password: '' },
        ctx.fetcher(),
        'POST',
        ctx.options.api.login,
        () => { nav(ctx.options.routes.private.home); }
    );

    return <div class="flex justify-center h-full palette--primary">
        <form {...f.events()} class="flex justify-center flex-col gap-2 w-full sm:w-80">
            <p class="text-lg">{ctx.t('_internal.login.title')}</p>
            <TextField prefix={<span class="material-symbols-outlined">person</span>} placeholder={ctx.t('_internal.login.username')}  accessor={f.accessor('username')} />
            <Password icon='lock' placeholder={ctx.t('_internal.login.password')} accessor={f.accessor('password')} />
            <Button disabled={f.accessor('username').getValue() == ''} type="submit">{ctx.t('_internal.ok')}</Button>
            <Button type="reset">{ ctx.t('_internal.reset') }</Button>
        </form>
    </div>;
}
