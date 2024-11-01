// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, createSignal, For, JSX, onMount, Show } from 'solid-js';

import { useApp, useOptions, User } from '@/app/context';
import {
    buildEnumsOptions, Button, Choice, ConfirmButton, Dialog, DialogRef, Divider,
    file2Base64, Form, FormAccessor, Icon, ObjectAccessor, Page, TextField, Upload, UploadRef
} from '@/components';
import { Passport } from '@/pages/admins/edit';
import { Sex, sexesMap } from '@/pages/admins/selector';

export default function(): JSX.Element {
    const opt = useOptions();
    const ctx = useApp();
    let uploadRef: UploadRef;
    let dialogRef: DialogRef;

    const infoAccess = new FormAccessor<User>({sex: 'unknown',state: 'normal',name: '',nickname: '', passports: []}, ctx, (obj)=>{
        return ctx.api.patch(opt.api.info, obj);
    }, async () => {
        await ctx.refetchUser();
    }, (obj) => {
        if (!obj.name) {
            return new Map([['name', ctx.locale().t('_i.error.canNotBeEmpty')]]);
        }
        if (!obj.nickname) {
            return new Map([['nickname', ctx.locale().t('_i.error.canNotBeEmpty')]]);
        }
    });

    const nameA = infoAccess.accessor<string>('name');
    const nicknameA = infoAccess.accessor<string>('nickname');
    const sexA = infoAccess.accessor<Sex>('sex');
    const passportA = infoAccess.accessor<User['passports']>('passports');
    
    const [passports, setPassports] = createSignal<Array<Passport>>([]);

    const [avatar, setAvatar] = createSignal('');
    let originAvatar = ''; // 原始的头像内容，在取消上传头像时，可以从此值恢复。

    createEffect(() => {
        const u = ctx.user();
        if (!u) { return; }

        infoAccess.setPreset(u);

        nameA.setValue(u.name!);
        nicknameA.setValue(u.nickname!);
        sexA.setValue(u.sex!);
        passportA.setValue(u.passports);

        setAvatar(u.avatar!);
        originAvatar = u.avatar!;
    });

    createEffect(async () => {
        if (uploadRef.files().length > 0) {
            setAvatar(await file2Base64(uploadRef.files()[0]));
        }
    });
    
    onMount(async () => {
        const r = await ctx.api.get<Array<Passport>>('/passports');
        if (!r.ok) {
            ctx.outputProblem(r.body);
            return;
        }
        setPassports(r.body!);
    });
    
    const account = new ObjectAccessor<Account>({ username: '', password: '' });
    const [current, setCurrent] = createSignal('');

    return <Page title='_i.page.current.profile' class="p--profile">
        <Upload ref={el => uploadRef = el} fieldName='files' action='/upload' />
        <div class="flex gap-4">
            <img class="rounded-full border border-palette-bg-low w-24 h-24" alt="avatar" src={avatar()} />
            <div class="flex flex-col my-4 items-start justify-center gap-2">
                <p class="text-2xl">{ctx.user()?.name}</p>
                <Show when={uploadRef!.files().length === 0}>
                    <Button palette='tertiary' onClick={async () => {
                        uploadRef.pick();
                    }}>{ctx.locale().t('_i.page.current.pickAvatar')}</Button>
                </Show>
                <Show when={uploadRef!.files().length > 0}>
                    <div class="flex gap-2">
                        <Button palette='primary' onClick={async () => {
                            const ret = await uploadRef.upload();
                            if (!ret) {
                                return;
                            }
                            setAvatar(ret[0]);
                            const r = await ctx.api.patch('/info', { 'avatar': ret[0] });
                            if (!r.ok) {
                                ctx.outputProblem(r.body);
                                return;
                            }
                            await ctx.refetchUser();
                        }}>{ctx.locale().t('_i.page.save')}</Button>

                        <Button palette='error' onClick={() => {
                            setAvatar(originAvatar);
                            uploadRef.delete(0);
                        }}>{ctx.locale().t('_i.cancel')}</Button>
                    </div>
                </Show>
            </div>
        </div>

        <Divider padding='4px' />

        <Form formAccessor={infoAccess} class="form">
            <TextField class="w-full" label={ctx.locale().t('_i.page.current.name')} accessor={nameA} />
            <TextField class="w-full" label={ctx.locale().t('_i.page.current.nickname')} accessor={nicknameA} />
            <Choice class="w-full" label={ctx.locale().t('_i.page.sex')} accessor={sexA} options={buildEnumsOptions(sexesMap, ctx)} />

            <div class="actions">
                <Button palette="secondary" type="reset" disabled={infoAccess.isPreset()}>{ctx.locale().t('_i.reset')}</Button>
                <Button palette="primary" type="submit" disabled={infoAccess.isPreset()}>{ctx.locale().t('_i.page.save')}</Button>
            </div>
        </Form>

        <Divider padding='8px'>{ctx.locale().t('_i.page.admin.passport')}</Divider>

        <fieldset class="c--table">
            <table>
                <thead>
                    <tr>
                        <th>{ctx.locale().t('_i.page.admin.passportTtype')}</th>
                        <th>{ctx.locale().t('_i.page.current.username')}</th>
                        <th>{ctx.locale().t('_i.page.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    <For each={passports()}>
                        {(item) => {
                            const username = createMemo(() => passportA.getValue()!.find((v) => v.id == item.id)?.username);
                            return <tr>
                                <td class="flex items-center">
                                    {item.id}
                                    <Icon icon='help' title={item.desc} class="ml-1 cursor-help" />
                                </td>
                                
                                <td>{username()}</td>
                                <td class="flex gap-2">
                                    <Show when={username()}>
                                        <Button palette='primary' icon rounded title={ctx.locale().t('_i.page.current.requestCode')} onclick={async () => {
                                            const r = await ctx.api.post(`/passports/${item.id}/code`);
                                            if (!r.ok) {
                                                await ctx.outputProblem(r.body);
                                                return;
                                            }
                                        }}>pin</Button>
                                        
                                        <ConfirmButton palette='error' icon rounded title={ctx.locale().t('_i.page.current.delete')} onClick={async () => {
                                            const r = await ctx.api.delete(`/passports/${item.id}`);
                                            if (!r.ok) {
                                                await ctx.outputProblem(r.body);
                                                return;
                                            }
                                            ctx.refetchUser();
                                        }}>delete</ConfirmButton>
                                    </Show>
                                    
                                    <Show when={!username()}>
                                        <Button palette='primary' icon rounded title={ctx.locale().t('_i.page.current.create')} onclick={async () => {
                                            setCurrent(item.id);
                                            dialogRef.showModal();
                                        }}>link</Button>
                                    </Show>
                                </td>
                            </tr>;
                        }}
                    </For>
                </tbody>
            </table>
        </fieldset>

        <Dialog ref={(el) => dialogRef = el} header={ctx.locale().t('_i.page.current.create')}
            actions={dialogRef!.DefaultActions(async ()=>{
                const r = await ctx.api.post(`/passports/${current()}`, account.object());
                if (!r.ok) {
                    await ctx.outputProblem(r.body);
                    return undefined;
                }
                
                ctx.refetchUser();
                return undefined;
            })}>
            <form class="flex flex-col gap-2">
                <TextField accessor={account.accessor<string>('username')} />
                <TextField accessor={account.accessor<string>('password')} />
            </form>
        </Dialog>
    </Page>;
}

interface Account {
    username: string;
    password: string;
}