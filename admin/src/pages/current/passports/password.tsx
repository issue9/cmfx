// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { JSX } from 'solid-js';

import { Button, Dialog, DialogRef, Icon, ObjectAccessor, Password, TextField } from '@/components';
import { useApp, useOptions } from '@/context';
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
        const ctx = useApp();
        const opt = useOptions();
        const nav = useNavigate();
        const account = new ObjectAccessor<PasswordAccount>({ username: '', password: '' });

        return <form onReset={() => account.reset()} onSubmit={async () => {
            const r = await ctx.api.post(`/passports/${this.#id}/login`, account.object());
            const ret = await ctx.login(r);
            if (ret === true) {
                nav(opt.routes.private.home);
            } else if (ret) {
                await ctx.outputProblem(ret);
            }
        }}>
            <TextField prefix={<Icon class="!py-0 !px-1 !flex items-center" icon='person' />}
                placeholder={ctx.locale().t('_i.page.current.username')} accessor={account.accessor('username', true)} />

            <Password icon='password_2' placeholder={ctx.locale().t('_i.page.current.password')} accessor={account.accessor('password', true)} />

            <Button palette='primary' disabled={account.accessor('username').getValue() == ''} type="submit">{ctx.locale().t('_i.ok')}</Button>
        
            <Button palette='secondary' disabled={account.isPreset()} type="reset" > {ctx.locale().t('_i.reset')} </Button>
        </form>;
    }

    Actions(__: RefreshFunc): JSX.Element {
        let dialogRef: DialogRef;
        const ctx = useApp();
        const pwd = new ObjectAccessor<PasswordValue>({ old: '', new: '' });

        return <>
            <Button icon rounded title={ctx.locale().t('_i.page.current.changePassword')} onClick={() => {
                dialogRef.showModal();
            }}>passkey</Button>

            <Dialog ref={(el) => dialogRef = el} header={ctx.locale().t('_i.page.current.changePassword')}
                actions={dialogRef!.DefaultActions(async () => {
                    const r = await ctx.api.put(`/passports/${this.#id}`, pwd.object());
                    if (!r.ok) {
                        await ctx.outputProblem(r.body);
                        return undefined;
                    }

                    await ctx.refetchUser();
                    return undefined;
                })}>
                <form class="flex flex-col gap-2">
                    <TextField placeholder={ctx.locale().t('_i.page.current.oldPassword')} accessor={pwd.accessor<string>('old')} />
                    <TextField placeholder={ctx.locale().t('_i.page.current.newPassword')} accessor={pwd.accessor<string>('new')} />
                </form>
            </Dialog>
        </>;
    }
}