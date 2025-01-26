// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { createSignal, JSX, Show } from 'solid-js';

import { Button, Dialog, DialogRef, FieldAccessor, Icon, ObjectAccessor, TextField, useApp, useOptions } from '@/components';
import { PassportComponents } from './passports';

interface Account {
    username: string;
    code: string;
}

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

            <TextField prefix={<Icon class="!py-0 !px-1 flex items-center" icon='pin' />}
                placeholder={ctx.locale().t('_i.page.current.code')} accessor={account.accessor('code', true)} />

            <Button palette='primary' disabled={account.accessor('username').getValue() == ''} type="submit">{ctx.locale().t('_i.ok')}</Button>

            <Button palette='secondary' disabled={account.isPreset()} type="reset">{ctx.locale().t('_i.reset')}</Button>
        </form>;
    }
    
    Actions(username?: string): JSX.Element {
        const ctx = useApp();
        let dialogRef: DialogRef;
        const code = FieldAccessor('code', '');
        const [secret, setSecret] = createSignal<Secret>({secret:'',username:''});

        return <>
            <Show when={username}>
                <Button icon rounded title={ctx.locale().t('_i.page.current.unbindTOTP')} onClick={async () => {
                    const r = await ctx.api.delete(`/passports/${this.#id}`);
                    if (!r.ok) {
                        ctx.outputProblem(r.body);
                    }
                }}>link_off</Button>
            </Show>

            <Show when={!username}>
                <Button icon rounded title={ctx.locale().t('_i.page.current.requestTOTPSecret')} onClick={async () => {
                    const r = await ctx.api.post<Secret>(`/passports/${this.#id}/secret`);
                    if (!r.ok) {
                        ctx.outputProblem(r.body);
                        return;
                    }

                    setSecret(r.body!);
                    dialogRef.showModal();
                }}>add_link</Button>
                
                <Dialog ref={(el) => dialogRef = el} header={ctx.locale().t('_i.page.current.changePassword')}
                    actions={dialogRef!.DefaultActions(async () => {
                        const r = await ctx.api.put(`/passports/${this.#id}`, {'code': code.getValue()});
                        if (!r.ok) {
                            await ctx.outputProblem(r.body);
                            return undefined;
                        }
                
                        await ctx.refetchUser();
                        return undefined;
                    })}>
                    <form class="flex flex-col gap-2">
                        <p>{ secret().username /* TODO 显示二维码 */ }</p>
                        <p>{ secret().secret }</p>
                        <TextField placeholder={ctx.locale().t('_i.page.current.newPassword')} accessor={code} />
                    </form>
                </Dialog>
            </Show>
        </>;
    }
}