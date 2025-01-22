// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { JSX } from 'solid-js';

import { Button, Icon, ObjectAccessor, TextField, useApp, useOptions } from '@/components';
import { PassportComponents } from './passports';

interface TOTPAccount {
    username: string;
    code: string;
}

/**
 * TOTP 登录方式
 */
export class TOTP implements PassportComponents {
    Login(): JSX.Element {
        const ctx = useApp();
        const opt = useOptions();
        const nav = useNavigate();

        const account = new ObjectAccessor<TOTPAccount>({ username: '', code: '' });

        return <form onReset={() => account.reset()} onSubmit={async () => {
            const r = await ctx.api.post('/passports/code/login', account.object());
            const ret = await ctx.login(r);
            if (ret === true) {
                nav(opt.routes.private.home);
            } else if (ret) {
                await ctx.outputProblem(ret);
            }
        }}>
            <TextField prefix={<Icon class="!py-0 !px-1 flex items-center" icon='person' />}
                placeholder={ctx.locale().t('_i.page.current.username')} accessor={account.accessor('username', true)} />

            <TextField prefix={<Icon class="!py-0 !px-1 flex items-center" icon='pin' />}
                placeholder={ctx.locale().t('_i.page.current.code')} accessor={account.accessor('code', true)} />

            <Button palette='primary' disabled={account.accessor('username').getValue() == ''} type="submit">{ctx.locale().t('_i.ok')}</Button>

            <Button palette='secondary' disabled={account.isPreset()} type="reset">{ctx.locale().t('_i.reset')}</Button>
        </form>;
    }
    
    Actions(id: string): JSX.Element {
        //
        return <>
            TODO
        </>;
    }
}