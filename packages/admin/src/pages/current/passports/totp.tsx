// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Button, ConfirmButton, Dialog, DialogRef, fieldAccessor, ObjectAccessor, QRCode, TextField
} from '@cmfx/components';
import { base32nopad } from '@scure/base';
import { useNavigate } from '@solidjs/router';
import { createSignal, JSX, Show } from 'solid-js';
import IconAddLink from '~icons/material-symbols/add-link';
import IconLinkOff from '~icons/material-symbols/link-off';
import IconPerson from '~icons/material-symbols/person';
import IconPin from '~icons/material-symbols/pin';

import { useAdmin, useLocale } from '@/context';
import { PassportComponents, RefreshFunc } from './passports';
import styles from './style.module.css';

// 登录框的字段
type Account = {
    username: string;
    code: string;
};

// 请求绑定时返回的字段
type Secret = {
    secret: string;
    username: string;
};

/**
 * TOTP 登录方式
 */
export class TOTP implements PassportComponents {
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
        const l = useLocale();
        const [api, act, opt] = useAdmin();
        const nav = useNavigate();

        const account = new ObjectAccessor<Account>({ username: '', code: '' });

        return <form class={styles.totp} onReset={() => account.reset()} onSubmit={async () => {
            const r = await api.post(`/passports/${this.#id}/login`, await account.object());
            const ret = await api.login(r);
            if (ret === true) {
                nav(opt.routes.private.home);
            } else if (ret) {
                await act.outputProblem(ret);
            }
        }}>
            <TextField hasHelp prefix={<IconPerson class={styles['text-field']} />} autocomplete='username'
                placeholder={l.t('_p.current.username')} accessor={account.accessor<string>('username')} />
            <TextField hasHelp prefix={<IconPin class={styles['text-field']} />} autocomplete='one-time-code'
                placeholder={l.t('_p.current.verifyCode')} accessor={account.accessor<string>('code')} />

            <Button palette='primary' disabled={account.accessor('username').getValue() == ''} type="submit">{l.t('_c.ok')}</Button>
            <Button palette='secondary' disabled={account.isPreset()} type="reset">{l.t('_c.reset')}</Button>
        </form>;
    }

    Actions(f: RefreshFunc, username?: string): JSX.Element {
        const [api, act, opt] = useAdmin();
        const l = useLocale();

        let dialogRef: DialogRef;
        const code = fieldAccessor('code', '');
        const [qr, setQR] = createSignal<string>('');

        return <>
            <Show when={username}>
                <ConfirmButton palette='error' square rounded title={l.t('_p.current.unbindTOTP')} onclick={async () => {
                    const r = await api.delete(`/passports/${this.#id}`);
                    if (!r.ok) {
                        act.outputProblem(r.body);
                        return;
                    }
                    await f();
                }}><IconLinkOff /></ConfirmButton>
            </Show>

            <Show when={!username}>
                <Button square rounded title={l.t('_p.current.bindTOTP')} onclick={async () => {
                    const r = await api.post<Secret>(`/passports/${this.#id}/secret`);
                    if (!r.ok) {
                        act.outputProblem(r.body);
                        return;
                    }

                    const s = r.body! as Secret;
                    s.secret = base32nopad.encode(new TextEncoder().encode(s.secret));
                    setQR(`otpauth://totp/${opt.title}:${s.username}?secret=${s.secret}&issuer=${opt.title}`);
                    dialogRef.element().showModal();
                }}><IconAddLink /></Button>

                <Dialog ref={(el) => dialogRef = el} header={l.t('_p.current.bindTOTP')}
                    actions={dialogRef!.DefaultActions(async () => {
                        const r = await api.post(`/passports/${this.#id}`, {'code': code.getValue()});
                        if (!r.ok) {
                            code.setError(l.t('_p.current.invalidCode'));
                            return false;
                        }

                        await act.refetchUser();
                    })}>
                    <form class={styles['action-form']}>
                        <p title={qr()}>
                            <QRCode type='rounded' value={qr()} />
                        </p>
                        <br />
                        <TextField hasHelp placeholder={l.t('_p.current.verifyCode')} accessor={code} />
                    </form>
                </Dialog>
            </Show>
        </>;
    }
}
