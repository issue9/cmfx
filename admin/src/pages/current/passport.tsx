// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { JSX } from 'solid-js';

import { useApp, useOptions } from '@/app/context';
import { Button, Dialog, DialogRef, Icon, ObjectAccessor, Password, TextField } from '@/components';

export interface Passport {
    id: string;
    desc: string;
}

export interface PassportComponents {
    /**
     * 登录页面
     */
    Login(): JSX.Element;
    
    /**
     * 编辑页的操作按钮
     *
     * @param id 当前组件的 ID
     */
    Actions(id: string): JSX.Element;
}

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
class Pwd implements PassportComponents {
    Login(): JSX.Element {
        const ctx = useApp();
        const opt = useOptions();
        const nav = useNavigate();
        const account = new ObjectAccessor<PasswordAccount>({ username: '', password: '' });
    
        return <form onReset={() => account.reset()} onSubmit={async () => {
            const r = await ctx.api.post('/passports/password/login', account.object());
            const ret = await ctx.login(r);
            if (ret === true) {
                nav(opt.routes.private.home);
            } else if (ret) {
                await ctx.outputProblem(ret);
            }
        }}>
            <TextField prefix={<Icon class="!py-0 !px-1 flex items-center" icon='person' />}
                placeholder={ctx.locale().t('_i.page.current.username')} accessor={account.accessor('username', true)} />
    
            <Password icon='password_2' placeholder={ctx.locale().t('_i.page.current.password')} accessor={account.accessor('password', true)} />
    
            <Button palette='primary' disabled={account.accessor('username').getValue() == ''} type="submit">{ctx.locale().t('_i.ok')}</Button>
        
            <Button palette='secondary' disabled={account.isPreset()} type="reset" > {ctx.locale().t('_i.reset')} </Button>
        </form>;
    }

    Actions(id: string): JSX.Element {
        let dialogRef: DialogRef;
        const ctx = useApp();
        const pwd = new ObjectAccessor<PasswordValue>({ old: '', new: '' });
        
        return <>
            <Button icon rounded title={ctx.locale().t('_i.page.current.changePassword')} onClick={() => {
                dialogRef.showModal();
            }}>passkey</Button>
            
            <Dialog ref={(el) => dialogRef = el} header={ctx.locale().t('_i.page.current.changePassword')}
                actions={dialogRef!.DefaultActions(async () => {
                    const r = await ctx.api.put(`/passports/${id}`, pwd.object());
                    if (!r.ok) {
                        await ctx.outputProblem(r.body);
                        return undefined;
                    }
                            
                    ctx.refetchUser();
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

interface TOTPAccount {
    username: string;
    code: string;
}

/**
 * TOTP 登录方式
 */
class TOTP implements PassportComponents {
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

export const componens = new Map<string, PassportComponents>([
    ['password', new Pwd()],
    ['totp', new TOTP()],
]);
