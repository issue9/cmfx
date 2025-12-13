// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Button, ConfirmButton, Dialog, DialogRef, fieldAccessor,
    Label, RemoteTable, RemoteTableRef, TextField, useLocale
} from '@cmfx/components';
import { Token } from '@cmfx/core';
import { base64urlnopad } from '@scure/base';
import { useNavigate } from '@solidjs/router';
import { JSX, Show } from 'solid-js';
import IconAddLink from '~icons/material-symbols/add-link';
import IconClose from '~icons/material-symbols/close';
import IconCredit from '~icons/material-symbols/credit-card-gear';
import IconDelete from '~icons/material-symbols/delete';
import IconLinkOff from '~icons/material-symbols/link-off';
import IconPerson from '~icons/material-symbols/person';

import { useAdmin } from '@/context';
import { PassportComponents, RefreshFunc } from './passports';
import styles from './style.module.css';

const textDecoder = new TextDecoder('utf-8');

type Credential = {
    id: string;
    created: string;
    last: string;
    ua: string;
};

export class Webauthn implements PassportComponents {
    #id: string;

    /**
     * 构造函数
     *
     * @param id - 组件的 ID；
     */
    constructor(id: string) {
        this.#id = id;
    }

    Login(): JSX.Element {
        const [api, act, opt] = useAdmin();
        const l = useLocale();
        const nav = useNavigate();
        const account = fieldAccessor('account', '');

        return <form class={styles.webauthn} onReset={() => account.reset()} onSubmit={async () => {
            const r1 = await api.get<CredentialRequestOptions>(`/passports/${this.#id}/login/${account.getValue()}`);
            if (!r1.ok) {
                if (r1.status === 401) {
                    account.setError(l.t('_p.current.invalidAccount'));
                    return;
                }
                await act.handleProblem(r1.body);
                return;
            }

            const pubKey = r1.body!.publicKey!;
            pubKey.challenge = new Uint8Array(base64urlnopad.decode(textDecoder.decode(pubKey.challenge)));
            if (pubKey.allowCredentials) {
                pubKey.allowCredentials = pubKey.allowCredentials.map(c => ({
                    ...c,
                    id: base64urlnopad.decode(textDecoder.decode(c.id)),
                })) as any;
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
            const r2 = await api.post<Token>(`/passports/${this.#id}/login/${account.getValue()}`, pc);
            if (!r2.ok) {
                if (r1.status === 401) {
                    account.setError(l.t('_p.current.invalidAccount'));
                    return;
                }
                await act.handleProblem(r2.body);
                return;
            }

            const ret = await api.login(r2);
            if (ret === true) {
                nav(opt.routes.private.home);
            } else if (ret) {
                await act.handleProblem(ret);
            }
        }}>
            <TextField hasHelp prefix={<IconPerson class={styles['text-field']} />} autocomplete='username'
                suffix={
                    <Show when={account.getValue()!==''}>
                        <IconClose class={styles['text-field']} onClick={()=>account.setValue('')} />
                    </Show>
                }
                placeholder={l.t('_p.current.username')} accessor={account} />

            <Button palette='primary' disabled={account.getValue() == ''} type="submit">{l.t('_c.ok')}</Button>
        </form>;
    }

    Actions(f: RefreshFunc): JSX.Element {
        const l = useLocale();
        const [api, act] = useAdmin();
        let dialogRef: DialogRef;
        let tableRef: RemoteTableRef<Credential>;

        return <>
            <Button square rounded title={l.t('_p.current.bindWebauthn')} onclick={async () => {
                dialogRef.element().showModal();
            }}><IconCredit /></Button>

            <Dialog class="w-[80%]" ref={(el) => dialogRef = el} header={
                <Label icon={<IconCredit />}>{l.t('_p.current.webauthnCredentials')}</Label>
            }>
                <div class="overflow-auto">
                    <RemoteTable<Credential, {}> rest={api} ref={el => tableRef = el} queries={{}} path={`/passports/${this.#id}/credentials`}
                        columns={[
                            { id: 'id', label: l.t('_p.id') },
                            { id: 'ua', label: l.t('_p.current.ua') },
                            {
                                id: 'last', label: l.t('_p.current.lastUsed'),
                                content: (_, val) => l.datetimeFormat().format(new Date(val as string))
                            },
                            {
                                id: 'id', label: l.t('_p.actions'), renderContent: (_, val) => (
                                    <ConfirmButton square rounded palette='error' title={l.t('_p.current.unbindWebauthn')}
                                        onclick={async () => {
                                            const r1 = await api.delete(`/passports/${this.#id}/credentials/${val}`);
                                            if (!r1.ok) {
                                                await act.handleProblem(r1.body);
                                                return;
                                            }

                                            tableRef.refresh();
                                            await f();
                                        }}
                                    ><IconDelete /></ConfirmButton>
                                )
                            },
                        ]}
                        toolbar={<div class="flex gap-2">
                            <Button palette='primary' rounded onclick={async () => {
                                const r1 = await api.get<CredentialCreationOptions>(`/passports/${this.#id}/register`);
                                if (!r1.ok) {
                                    await act.handleProblem(r1.body);
                                    return;
                                }

                                const pubKey = r1.body!.publicKey!;
                                pubKey.challenge = new Uint8Array(base64urlnopad.decode(textDecoder.decode(pubKey.challenge)));
                                if (pubKey.user && pubKey.user.id) {
                                    pubKey.user.id = new Uint8Array(base64urlnopad.decode(pubKey.user.id as any));
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

                                const r2 = await api.post(`/passports/${this.#id}/register`, pc);
                                if (!r2.ok) {
                                    await act.handleProblem(r2.body);
                                    return;
                                }

                                tableRef.refresh();
                                await f();
                            }}><IconAddLink />&#160;{l.t('_p.current.bindWebauthn')}</Button>

                            <ConfirmButton palette='secondary' rounded onclick={async () => {
                                const r1 = await api.delete(`/passports/${this.#id}`);
                                if (!r1.ok) {
                                    await act.handleProblem(r1.body);
                                    return;
                                }
                                await f();
                            }}><IconLinkOff />&#160;{l.t('_p.current.unbindAllWebauthn')}</ConfirmButton>
                        </div>}
                    />
                </div>
            </Dialog>
        </>;
    }
}

function bufferToBase64URL(b: ArrayBuffer): string {
    return base64urlnopad.encode(new Uint8Array(b));
}
