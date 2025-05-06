// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Button,
    Divider, file2Base64, Form, FormAccessor, Icon,
    Page, TextField,
    Upload, UploadRef
} from '@cmfx/components';
import { createEffect, createMemo, createSignal, For, JSX, onMount, Show } from 'solid-js';

import { use, useLocale, User } from '@/context';
import { Passport, Sex, SexSelector } from '@/pages/common';
import { PassportComponents } from './passports';

interface Props {
    passports: Map<string, PassportComponents>;
}

export function Profile(props: Props): JSX.Element {
    const [api, act, opt] = use();
    const l = useLocale();
    let uploadRef: UploadRef;

    const infoAccess = new FormAccessor<User>({sex: 'unknown',state: 'normal',name: '',nickname: '', passports: []}, act, (obj)=>{
        return api.patch(opt.api.info, obj);
    }, async () => {
        await act.refetchUser();
    }, (obj) => {
        if (!obj.name) {
            return new Map([['name', l.t('_i.error.canNotBeEmpty')]]);
        }
        if (!obj.nickname) {
            return new Map([['nickname', l.t('_i.error.canNotBeEmpty')]]);
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
        const r = await api.get<Array<Passport>>('/passports');
        if (!r.ok) {
            await act.outputProblem(r.body);
            return;
        }
        setPassports(r.body!);
    });

    return <Page title='_i.current.profile' class="p--profile">
        <Upload ref={el => uploadRef = el} fieldName='files' action='/uploads' />
        <div class="flex gap-4">
            <img class="avatar" alt="avatar" src={avatar()} />
            <div class="name">
                <p class="text-2xl">{act.user()?.name}</p>
                <Show when={uploadRef!.files().length === 0}>
                    <Button palette='tertiary' onClick={async () => {
                        uploadRef.pick();
                    }}>{l.t('_i.current.pickAvatar')}</Button>
                </Show>
                <Show when={uploadRef!.files().length > 0}>
                    <div class="flex gap-2">
                        <Button palette='primary' onClick={async () => {
                            const ret = await uploadRef.upload();
                            if (!ret) {
                                return;
                            }
                            setAvatar(ret[0]);
                            const r = await api.patch('/info', { 'avatar': ret[0] });
                            if (!r.ok) {
                                await act.outputProblem(r.body);
                                return;
                            }
                            await act.refetchUser();
                        }}>{l.t('_i.save')}</Button>

                        <Button palette='error' onClick={() => {
                            setAvatar(originAvatar);
                            uploadRef.delete(0);
                        }}>{l.t('_i.cancel')}</Button>
                    </div>
                </Show>
            </div>
        </div>

        <Divider padding='4px' />

        <Form formAccessor={infoAccess} class="form">
            <TextField class="w-full" label={l.t('_i.current.name')} accessor={nameA} />
            <TextField class="w-full" label={l.t('_i.nickname')} accessor={nicknameA} />
            <SexSelector class="w-full" label={l.t('_i.sex')} accessor={sexA} />

            <div class="actions">
                <Button palette="secondary" type="reset" disabled={infoAccess.isPreset()}>{l.t('_i.reset')}</Button>
                <Button palette="primary" type="submit" disabled={infoAccess.isPreset()}>{l.t('_i.save')}</Button>
            </div>
        </Form>

        <Divider padding='8px'>{l.t('_i.admin.passport')}</Divider>

        <fieldset class="c--table">
            <table>
                <thead>
                    <tr>
                        <th>{l.t('_i.admin.passportType')}</th>
                        <th>{l.t('_i.current.username')}</th>
                        <th>{l.t('_i.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    <For each={passports()}>
                        {(item) => {
                            const username = createMemo(() => passportA.getValue()!.find((v) => v.id == item.id)?.identity);

                            return <tr>
                                <td class="flex items-center">
                                    {item.id}
                                    <Icon icon='help' title={item.desc} class="ml-1 cursor-help" />
                                </td>

                                <td>{username()}</td>
                                <td class="flex gap-2">
                                    {props.passports.get(item.id)?.Actions(async()=>await act.refetchUser(), username())}
                                </td>
                            </tr>;
                        }}
                    </For>
                </tbody>
            </table>
        </fieldset>
    </Page>;
}
