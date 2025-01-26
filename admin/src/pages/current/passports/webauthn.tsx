// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { JSX, Show } from 'solid-js';

import { Button, ConfirmButton, Icon, ObjectAccessor, Password, TextField, useApp, useOptions } from '@/components';
import { PassportComponents, RefreshFunc } from './passports';

interface Account {
    username: string;
    code: string;
}

export class Webauthn implements PassportComponents {
    #id: string;

    /**
     * 构造函数
     *
     * @param id 组件的 ID；
     */
    constructor(id: string) {
        this.#id = id;
    }

    Login(): JSX.Element {
        const ctx = useApp();
        const opt = useOptions();
        const nav = useNavigate();
        const account = new ObjectAccessor<Account>({ username: '', code: '' });
        
        return <form onReset={() => account.reset()} onSubmit={async () => {
            const r = await ctx.api.post(`/passports/${this.#id}/login`, account.object());
            const ret = await ctx.login(r);
            if (ret === true) {
                nav(opt.routes.private.home);
            } else if (ret) {
                await ctx.outputProblem(ret);
            }
        }}>
            <TextField prefix={<Icon class="!py-0 !px-1 flex items-center" icon='person' />}
                placeholder={ctx.locale().t('_i.page.current.username')} accessor={account.accessor('username', true)} />
        
            <Password icon='password_2' placeholder={ctx.locale().t('_i.page.current.password')} accessor={account.accessor('code', true)} />
        
            <Button palette='primary' disabled={account.accessor('username').getValue() == ''} type="submit">{ctx.locale().t('_i.ok')}</Button>
                
            <Button palette='secondary' disabled={account.isPreset()} type="reset" > {ctx.locale().t('_i.reset')} </Button>
        </form>;
    }

    Actions(f: RefreshFunc, username?: string): JSX.Element {
        const ctx = useApp();

        return <>
            <Show when={!username}>
                <Button icon rounded title={ctx.locale().t('_i.page.current.bindWebauthn')} onClick={() => {
                    // TODO
                }}>add_link</Button>
            </Show>

            <Show when={username}>
                <ConfirmButton palette='error' icon rounded title={ctx.locale().t('_i.page.current.unbindWebauthn')} onClick={() => {
                    // TODO
                }}>link_off</ConfirmButton>
            </Show>
        </>;
    }
}
