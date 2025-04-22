// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Button, ConfirmButton, Dialog, DialogRef, FieldAccessor,
    Icon, Label, RemoteTable, RemoteTableRef, TextField
} from '@cmfx/components';
import { Token } from '@cmfx/core';
import { base64urlnopad } from '@scure/base';
import { useNavigate } from '@solidjs/router';
import { JSX, Show } from 'solid-js';

import { useAdmin, useOptions } from '@/context';
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
        const ctx = useAdmin();
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
            const credential = await navigator.credentials.get({ publicKey: pubKey }) as any;

            const pc = {
                id: credential.id,
                rawId: bufferToBase64URL(credential.rawId),
                type: credential.type,
                response: {
                    authenticatorData: bufferToBase64URL(credential.response.authenticatorData),
                    clientDataJSON: bufferToBase64URL(credential.response.clientDataJSON),
                    signature: bufferToBase64URL(credential.response.signature),
                    userHandle: credential.response.userHandle ? bufferToBase64URL(credential.response.userHandle) : null
                }
            };
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
            <TextField prefix={<Icon class="!py-0 !px-1 !flex !items-center" icon='person' />}
                suffix={
                    <Show when={account.getValue()!==''}>
                        <Icon class="!py-0 !px-1 !flex !items-center" icon='close' onClick={()=>account.setValue('')} />
                    </Show>
                }
                placeholder={ctx.locale().t('_i.page.current.username')} accessor={account} />

            <Button palette='primary' disabled={account.getValue() == ''} type="submit">{ctx.locale().t('_i.ok')}</Button>
        </form>;
    }

    Actions(f: RefreshFunc): JSX.Element {
        const ctx = useAdmin();
        let dialogRef: DialogRef;
        let tableRef: RemoteTableRef<Credential>;

        return <>
            <Button icon rounded title={ctx.locale().t('_i.page.current.bindWebauthn')} onClick={async () => {
                dialogRef.showModal();
            }}>credit_card_gear</Button>

            <Dialog class="w-[80%]" ref={(el) => dialogRef = el} header={
                <Label icon='credit_card_gear'>{ctx.locale().t('_i.page.current.webauthnCredentials')}</Label>
            }>
                <div class="overflow-auto">
                    <RemoteTable<Credential, {}> ref={el => tableRef = el} queries={{}} path={`/passports/${this.#id}/credentials`}
                        columns={[
                            { id: 'id', label: ctx.locale().t('_i.page.id') },
                            { id: 'ua', label: ctx.locale().t('_i.page.current.ua') },
                            { id: 'last', label: ctx.locale().t('_i.page.current.lastUsed'), content: (_, val) => ctx.locale().datetime(val) },
                            {
                                id: 'id', label: ctx.locale().t('_i.page.actions'), renderContent: (_, val) => (
                                    <ConfirmButton icon rounded palette='error' title={ctx.locale().t('_i.page.current.unbindWebauthn')} onClick={async () => {
                                        const r1 = await ctx.api.delete(`/passports/${this.#id}/credentials/${val}`);
                                        if (!r1.ok) {
                                            ctx.outputProblem(r1.body);
                                            return;
                                        }

                                        tableRef.refresh();
                                        await f();
                                    }}>delete</ConfirmButton>
                                )
                            },
                        ]}
                        toolbar={<div class="flex gap-2">
                            <Button palette='primary' rounded onClick={async () => {
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
                                const credential = await navigator.credentials.create({ publicKey: pubKey }) as any;

                                const pc = {
                                    id: credential.id,
                                    rawId: bufferToBase64URL(credential.rawId),
                                    type: credential.type,
                                    response: {
                                        attestationObject: bufferToBase64URL(credential.response.attestationObject),
                                        clientDataJSON: bufferToBase64URL(credential.response.clientDataJSON),
                                    }
                                };

                                const r2 = await ctx.api.post(`/passports/${this.#id}/register`, pc);
                                if (!r2.ok) {
                                    ctx.outputProblem(r2.body);
                                    return;
                                }

                                tableRef.refresh();
                                await f();
                            }}><Icon icon='add_link' />&#160;{ctx.locale().t('_i.page.current.bindWebauthn')}</Button>

                            <ConfirmButton palette='secondary' rounded onClick={async () => {
                                const r1 = await ctx.api.delete(`/passports/${this.#id}`);
                                if (!r1.ok) {
                                    ctx.outputProblem(r1.body);
                                    return;
                                }
                                await f();
                            }}><Icon icon='link_off' />&#160;{ctx.locale().t('_i.page.current.unbindAllWebauthn')}</ConfirmButton>
                        </div>}
                    />
                </div>
            </Dialog>
        </>;
    }
}

interface Credential {
    created: string;
    last: string;
    id: string;
    ua: string;
}

function bufferToBase64URL(b: ArrayBuffer): string {
    return base64urlnopad.encode(new Uint8Array(b));
}