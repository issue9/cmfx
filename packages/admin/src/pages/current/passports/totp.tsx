// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Button, ConfirmButton, Dialog, DialogRef, FieldAccessor,
    Icon, ObjectAccessor, QRCode, TextField,
} from '@cmfx/components';
import { base32nopad } from '@scure/base';
import { useNavigate } from '@solidjs/router';
import { createSignal, JSX, Show } from 'solid-js';

import { use, useLocale } from '@/context';
import { PassportComponents, RefreshFunc } from './passports';

// 登录框的字段
interface Account {
    username: string;
    code: string;
}

// 请求绑定时返回的字段
interface Secret {
    secret: string;
    username: string;
}

/**
 * TOTP 登录方式
 */
export class TOTP implements PassportComponents {
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
        const l = useLocale();
        const [api, act, opt] = use();
        const nav = useNavigate();

        const account = new ObjectAccessor<Account>({ username: '', code: '' });

        return <form onReset={() => account.reset()} onSubmit={async () => {
            const r = await api.post(`/passports/${this.#id}/login`, account.object());
            const ret = await api.login(r);
            if (ret === true) {
                nav(opt.routes.private.home);
            } else if (ret) {
                await act.outputProblem(ret);
            }
        }}>
            <TextField prefix={<Icon class="!py-0 !px-1 !flex !items-center" icon='person' />}
                placeholder={l.t('_i.current.username')} accessor={account.accessor('username', true)} />

            <TextField prefix={<Icon class="!py-0 !px-1 !flex !items-center" icon='pin' />}
                placeholder={l.t('_i.current.verifyCode')} accessor={account.accessor('code', true)} />

            <Button palette='primary' disabled={account.accessor('username').getValue() == ''} type="submit">{l.t('_i.ok')}</Button>

            <Button palette='secondary' disabled={account.isPreset()} type="reset">{l.t('_i.reset')}</Button>
        </form>;
    }

    Actions(f: RefreshFunc, username?: string): JSX.Element {
        const [api, act, opt] = use();
        const l = useLocale();

        let dialogRef: DialogRef;
        const code = FieldAccessor('code', '', true);
        const [qr, setQR] = createSignal<string>('');

        return <>
            <Show when={username}>
                <ConfirmButton palette='error' icon rounded title={l.t('_i.current.unbindTOTP')} onClick={async () => {
                    const r = await api.delete(`/passports/${this.#id}`);
                    if (!r.ok) {
                        act.outputProblem(r.body);
                        return;
                    }
                    await f();
                }}>link_off</ConfirmButton>
            </Show>

            <Show when={!username}>
                <Button icon rounded title={l.t('_i.current.bindTOTP')} onClick={async () => {
                    const r = await api.post<Secret>(`/passports/${this.#id}/secret`);
                    if (!r.ok) {
                        act.outputProblem(r.body);
                        return;
                    }

                    const s = r.body! as Secret;
                    s.secret = base32nopad.encode(new TextEncoder().encode(s.secret));
                    setQR(`otpauth://totp/${opt.title}:${s.username}?secret=${s.secret}&issuer=${opt.title}`);
                    dialogRef.showModal();
                }}>add_link</Button>

                <Dialog ref={(el) => dialogRef = el} header={l.t('_i.current.bindTOTP')}
                    actions={dialogRef!.DefaultActions(async () => {
                        const r = await api.post(`/passports/${this.#id}`, {'code': code.getValue()});
                        if (!r.ok) {
                            code.setError(l.t('_i.current.invalidCode'));
                            return false;
                        }

                        await act.refetchUser();
                    })}>
                    <form class="flex flex-col gap-2">
                        <p title={qr()}>
                            <QRCode type='rounded' value={qr()} />
                        </p>
                        <br />
                        <TextField placeholder={l.t('_i.current.verifyCode')} accessor={code} />
                    </form>
                </Dialog>
            </Show>
        </>;
    }
}
