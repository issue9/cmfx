// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Divider, file2Base64, Form, FormAPI, Page, TextField, Upload, UploadRef } from '@cmfx/components';
import { createEffect, createMemo, createSignal, For, JSX, onMount, Show } from 'solid-js';
import IconHelp from '~icons/material-symbols/help';

import { user } from '@/components';
import { useAdmin, useLocale, User } from '@/context';
import { PassportComponents } from './passports';
import styles from './style.module.css';

interface Props {
    passports: Map<string, PassportComponents>;
}

export function Profile(props: Props): JSX.Element {
    const [api, act, opt] = useAdmin();
    const l = useLocale();
    let uploadRef: UploadRef;

    const infoAccess = new FormAPI<User>({sex: 'unknown',state: 'normal',name: '',nickname: '', passports: []}, (obj)=>{
        return api.patch(opt.api.info, obj);
    }, act.outputProblem, async () => {
        await act.refetchUser();
    }, (obj) => {
        if (!obj.name) {
            return new Map([['name', l.t('_p.error.canNotBeEmpty')]]);
        }
        if (!obj.nickname) {
            return new Map([['nickname', l.t('_p.error.canNotBeEmpty')]]);
        }
    });

    const nameA = infoAccess.accessor<string>('name');
    const nicknameA = infoAccess.accessor<string>('nickname');
    const sexA = infoAccess.accessor<user.Sex>('sex');
    const passportA = infoAccess.accessor<User['passports']>('passports');

    const [passports, setPassports] = createSignal<Array<user.Passport>>([]);

    const [avatar, setAvatar] = createSignal('');
    let originAvatar = ''; // 原始的头像内容，在取消上传头像时，可以从此值恢复。

    createEffect(() => {
        const u = act.user();
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
        const r = await api.get<Array<user.Passport>>('/passports');
        if (!r.ok) {
            await act.outputProblem(r.body);
            return;
        }
        setPassports(r.body!);
    });

    return <Page title='_p.current.profile' class={styles.profile}>
        <Upload ref={el => uploadRef = el} fieldName='files' action='/uploads' />
        <div class="flex gap-4">
            <img class={styles.avatar} alt="avatar" src={avatar()} />
            <div class={styles.name}>
                <p class="text-2xl">{act.user()?.name}</p>
                <Show when={uploadRef!.files().length === 0}>
                    <Button palette='tertiary' onclick={async () => {
                        uploadRef.pick();
                    }}>{l.t('_p.current.pickAvatar')}</Button>
                </Show>
                <Show when={uploadRef!.files().length > 0}>
                    <div class="flex gap-2">
                        <Button palette='primary' onclick={async () => {
                            const ret = await uploadRef.upload();
                            if (!ret) { return; }

                            setAvatar(ret[0]);
                            const r = await api.patch('/info', { 'avatar': ret[0] });
                            if (!r.ok) {
                                await act.outputProblem(r.body);
                                return;
                            }
                            await act.refetchUser();
                        }}>{l.t('_p.save')}</Button>

                        <Button palette='error' onclick={() => {
                            setAvatar(originAvatar);
                            uploadRef.delete(0);
                        }}>{l.t('_o.cancel')}</Button>
                    </div>
                </Show>
            </div>
        </div>

        <Divider padding='4px' />

        <Form accessor={infoAccess} class={styles.form}>
            <TextField class="w-full" label={l.t('_p.current.name')} accessor={nameA} />
            <TextField class="w-full" label={l.t('_p.nickname')} accessor={nicknameA} />
            <user.SexSelector class="w-full" label={l.t('_p.sex')} accessor={sexA} />

            <div class={styles.actions}>
                <Button palette="secondary" type="reset" disabled={infoAccess.isPreset()}>{l.t('_c.reset')}</Button>
                <Button palette="primary" type="submit" disabled={infoAccess.isPreset()}>{l.t('_p.save')}</Button>
            </div>
        </Form>

        <Divider padding='8px'>{l.t('_p.admin.passport')}</Divider>

        <table class="cmfx-table">
            <thead>
                <tr>
                    <th>{l.t('_p.admin.passportType')}</th>
                    <th>{l.t('_p.current.username')}</th>
                    <th>{l.t('_p.actions')}</th>
                </tr>
            </thead>
            <tbody>
                <For each={passports()}>
                    {item => {
                        const username = createMemo(() => passportA.getValue()!.find((v) => v.id == item.id)?.identity);

                        return <tr>
                            <td class="flex items-center">
                                {item.id}
                                <span title={item.desc} class="ms-1 cursor-help"><IconHelp /></span>
                            </td>

                            <td>{username()}</td>
                            <td class="flex gap-2">
                                {props.passports.get(item.id)?.Actions(async () => await act.refetchUser(), username())}
                            </td>
                        </tr>;
                    }}
                </For>
            </tbody>
        </table>
    </Page>;
}
