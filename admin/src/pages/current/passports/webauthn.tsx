// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { base64urlnopad } from '@scure/base';
import { useNavigate } from '@solidjs/router';
import { JSX, Show } from 'solid-js';

import { Button, ConfirmButton, FieldAccessor, Icon, TextField, useApp, useOptions } from '@/components';
import { Token } from '@/core';
import { PassportComponents, RefreshFunc } from './passports';

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
        const account = FieldAccessor('account', '', true);

        return <form class="!gap-5" onReset={() => account.reset()} onSubmit={async () => {
            const r1 = await ctx.api.get<CredentialRequestOptions>(`/passports/${this.#id}/login/${account.getValue()}`);
            if (!r1.ok) {
                if (r1.status === 401) {
                    account.setError(ctx.locale().t('_i.page.current.invalidAccount'));
                    return;
                }
                ctx.outputProblem(r1.body);
                return;
            }

            const pubKey = r1.body!.publicKey!;
            pubKey.challenge = base64urlnopad.decode(pubKey.challenge as any);
            if (pubKey.allowCredentials) {
                pubKey.allowCredentials = pubKey.allowCredentials.map(c => ({
                    ...c,
                    id: base64urlnopad.decode(c.id as any),
                }));
            }
            const pc = await navigator.credentials.get({ publicKey: pubKey });
            const r2 = await ctx.api.post<Token>(`/passports/${this.#id}/login/${account.getValue()}`, pc);
            if (!r2.ok) {
                if (r1.status === 401) {
                    account.setError(ctx.locale().t('_i.page.current.invalidAccount'));
                    return;
                }
                ctx.outputProblem(r2.body);
                return;
            }

            const ret = await ctx.login(r2);
            if (ret === true) {
                nav(opt.routes.private.home);
            } else if (ret) {
                await ctx.outputProblem(ret);
            }
        }}>
            <TextField prefix={<Icon class="!py-0 !px-1 flex items-center" icon='person' />}
                suffix={
                    <Show when={account.getValue()!==''}>
                        <Icon class="!py-0 !px-1 flex items-center" icon='close' onClick={()=>account.setValue('')} />
                    </Show>
                }
                placeholder={ctx.locale().t('_i.page.current.username')} accessor={account} />

            <Button palette='primary' disabled={account.getValue() == ''} type="submit">{ctx.locale().t('_i.ok')}</Button>
        </form>;
    }

    Actions(f: RefreshFunc, username?: string): JSX.Element {
        const ctx = useApp();

        return <>
            <Show when={!username}>
                <Button icon rounded title={ctx.locale().t('_i.page.current.bindWebauthn')} onClick={async() => {
                    const r1 = await ctx.api.get<CredentialCreationOptions>(`/passports/${this.#id}/register`);
                    if (!r1.ok) {
                        ctx.outputProblem(r1.body);
                        return;
                    }

                    const pubKey = r1.body!.publicKey!;
                    pubKey.challenge = base64urlnopad.decode(pubKey.challenge as any);
                    if (pubKey.user && pubKey.user.id) {
                        pubKey.user.id = base64urlnopad.decode(pubKey.user.id as any);
                    }
                    const credential = await navigator.credentials.create({publicKey: pubKey});

                    const r2 = await ctx.api.post(`/passports/${this.#id}/register`, credential);
                    if (!r2.ok) {
                        ctx.outputProblem(r2.body);
                        return;
                    }

                    await ctx.refetchUser();
                }}>add_link</Button>
            </Show>

            <Show when={username}>
                <ConfirmButton palette='error' icon rounded title={ctx.locale().t('_i.page.current.unbindWebauthn')} onClick={async () => {
                    const r1 = await ctx.api.delete(`/passports/${this.#id}`);
                    if (!r1.ok) {
                        ctx.outputProblem(r1.body);
                        return;
                    }
                    
                    await f();
                }}>link_off</ConfirmButton>
            </Show>
        </>;
    }
}
