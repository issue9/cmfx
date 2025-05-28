// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Dialog, DialogRef, Icon, ObjectAccessor, Password, TextField } from '@cmfx/components';
import { useNavigate } from '@solidjs/router';
import { JSX } from 'solid-js';

import { use, useLocale } from '@/context';
import { PassportComponents, RefreshFunc } from './passports';

interface PasswordAccount {
    username: string;
    password: string;
}

interface PasswordValue {
    old: string;
    new: string;
}

/**
 * 密码登录方式
 */
export class Pwd implements PassportComponents {
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
        const account = new ObjectAccessor<PasswordAccount>({ username: '', password: '' });

        return <form onReset={() => account.reset()} onSubmit={async () => {
            const r = await api.post(`/passports/${this.#id}/login`, account.object());
            const ret = await act.login(r);
            if (ret === true) {
                nav(opt.routes.private.home);
            } else if (ret) {
                await act.outputProblem(ret);
            }
        }}>
            <TextField prefix={<Icon class="!py-0 !px-1 !flex items-center" icon='person' />}
                placeholder={l.t('_p.current.username')} accessor={account.accessor('username', true)} />

            <Password icon='password_2' placeholder={l.t('_p.current.password')} accessor={account.accessor('password', true)} />

            <Button palette='primary' disabled={account.accessor('username').getValue() == ''} type="submit">{l.t('_c.ok')}</Button>
        
            <Button palette='secondary' disabled={account.isPreset()} type="reset" > {l.t('_c.reset')} </Button>
        </form>;
    }

    Actions(__: RefreshFunc): JSX.Element {
        let dialogRef: DialogRef;
        const l = useLocale();
        const [api, act] = use();
        const pwd = new ObjectAccessor<PasswordValue>({ old: '', new: '' });

        return <>
            <Button icon rounded title={l.t('_p.current.changePassword')} onClick={() => {
                dialogRef.showModal();
            }}>passkey</Button>

            <Dialog ref={(el) => dialogRef = el} header={l.t('_p.current.changePassword')}
                actions={dialogRef!.DefaultActions(async () => {
                    const r = await api.put(`/passports/${this.#id}`, pwd.object());
                    if (!r.ok) {
                        await act.outputProblem(r.body);
                        return undefined;
                    }

                    await act.refetchUser();
                    return undefined;
                })}>
                <form class="flex flex-col gap-2">
                    <TextField placeholder={l.t('_p.current.oldPassword')} accessor={pwd.accessor<string>('old')} />
                    <TextField placeholder={l.t('_p.current.newPassword')} accessor={pwd.accessor<string>('new')} />
                </form>
            </Dialog>
        </>;
    }
}