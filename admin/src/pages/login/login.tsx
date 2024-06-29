// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Form, XTextField } from '@/components';
import { useApp } from '@/pages/app';

interface Account {
    username: string;
    password: string;
}

export default function(): JSX.Element {
    const ctx = useApp();
    const f = new Form<Account>({username:'',password:''});

    return <form {...f.events(ctx.fetcher(), 'POST', '/login')} class="items-center flex justify-center flex-col gap-2">
        <p>{ctx.t('_internal.login.title')}</p>
        <XTextField icon="face" color='secondary' placeholder='username !' label="账号" name="username" f={f} />
        <XTextField label="密码" name="password" f={f} />
        <button class="button--filled-secondary" type="reset">reset</button>
        <button disabled={f.get('username')()==''} type="submit" class="button--filled-primary">{ctx.t('_internal.ok') as string}</button>
    </form>;
}
