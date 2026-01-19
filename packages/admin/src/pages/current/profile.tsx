// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import {
    Avatar, Button, createForm, Divider, fieldAccessor, file2Base64,
    Page, Table, TextField, Upload, UploadRef, useLocale
} from '@cmfx/components';
import { createEffect, createMemo, createSignal, For, JSX, onMount, Show } from 'solid-js';
import { z } from 'zod';
import IconHelp from '~icons/material-symbols/help';
import IconCamera from '~icons/material-symbols/photo-camera';

import { handleProblem, useAdmin, useOptions, useREST } from '@admin/app';
import { Passport, SexSelector } from '@admin/components';
import { Sex, sexSchema } from '@admin/schemas';
import { PassportComponents } from './passports';
import styles from './style.module.css';

interface Props {
    passports: Map<string, PassportComponents>;
}

const infoSchema = z.object({
    sex: sexSchema,
    name: z.string().min(2).max(10),
    nickname: z.string().min(2).max(10),
});

export function Profile(props: Props): JSX.Element {
    const api = useREST();
    const opt = useOptions();
    const usr = useAdmin();
    const l = useLocale();
    let uploadRef: UploadRef;

    const [fapi, Form, actions] = createForm({
        initValue: infoSchema.partial().parse({ sex: 'unknown' }),
        onProblem: async p => handleProblem(p),
        submit: async obj => { return api.patch(opt.api.info, obj); },
        onSuccess: async () => { await usr.refetch(); }
    });

    const [passports, setPassports] = createSignal<Array<Passport>>([]);

    const [avatar, setAvatar] = createSignal('');
    let originAvatar = ''; // 原始的头像内容，在取消上传头像时，可以从此值恢复。

    createEffect(() => {
        const info = usr.info();
        if (!info) { return; }

        fapi.setPreset(info);

        const nameA = fapi.accessor('name');
        const nicknameA = fapi.accessor('nickname');
        const sexA = fapi.accessor('sex');
        const passportA = fieldAccessor('passports', info.passports);

        nameA.setValue(info.name!);
        nicknameA.setValue(info.nickname!);
        sexA.setValue(info.sex!);
        passportA.setValue(info.passports);

        setAvatar(info.avatar!);
        originAvatar = info.avatar!;
    });

    createEffect(async () => {
        if (uploadRef.files().length > 0) {
            setAvatar(await file2Base64(uploadRef.files()[0]));
        }
    });

    onMount(async () => {
        const r = await api.get<Array<Passport>>('/passports');
        if (!r.ok) {
            await handleProblem(r.body);
            return;
        }
        setPassports(r.body!);
    });

    return <Page title='_p.current.profile' class={styles.profile}>
        <Upload ref={el => uploadRef = el} fieldName='files' upload={async data => {
            const ret = await api.upload<Array<string>>('/uploads', data);
            if (!ret.ok) {
                await handleProblem(ret.body);
                return undefined;
            }
            return ret.body;
        }} />
        <div class="flex gap-4">
            <Avatar class={styles.avatar} value={avatar()} fallback="avatar" hover={<IconCamera />} onclick={() => {
                uploadRef.pick();
            }} />
            <div class={styles.name}>
                <p class="text-2xl">{usr.info()?.name}</p>
                <Show when={uploadRef!.files().length > 0}>
                    <div class="flex gap-2">
                        <Button palette='primary' onclick={async () => {
                            const ret = await uploadRef.upload();
                            if (!ret) { return; }
                            setAvatar(ret[0]);

                            const r = await api.patch('/info', { 'avatar': ret[0] });
                            if (!r.ok) {
                                await handleProblem(r.body);
                                return;
                            }
                            await usr.refetch();
                        }}>{l.t('_p.save')}</Button>

                        <Button palette='error' onclick={() => {
                            setAvatar(originAvatar);
                            uploadRef.delete(0);
                        }}>{l.t('_c.cancel')}</Button>
                    </div>
                </Show>
            </div>
        </div>

        <Divider padding='4px' />

        <Form class={styles.form}>
            <TextField class="w-full" label={l.t('_p.current.name')} accessor={fapi.accessor('name')} />
            <TextField class="w-full" label={l.t('_p.nickname')} accessor={fapi.accessor('nickname')} />
            <SexSelector class="w-full" label={l.t('_p.sex')} accessor={fapi.accessor<Sex>('sex')} />

            <div class={styles.actions}>
                <actions.Reset palette="secondary" disabled={fapi.isPreset()}>{l.t('_c.reset')}</actions.Reset>
                <actions.Submit palette="primary" disabled={fapi.isPreset()}>{l.t('_p.save')}</actions.Submit>
            </div>
        </Form>

        <Divider padding='8px'>{l.t('_p.admin.passport')}</Divider>

        <Table hoverable>
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
                        const username = createMemo(() => usr.info()?.passports?.find(v => v.id == item.id)?.identity);

                        return <tr>
                            <td class="flex items-center">
                                {item.id}
                                <span title={item.desc} class="ms-1 cursor-help"><IconHelp /></span>
                            </td>

                            <td>{username()}</td>
                            <td class="flex gap-2">
                                {props.passports.get(item.id)?.Actions(async () => await usr.refetch(), username())}
                            </td>
                        </tr>;
                    }}
                </For>
            </tbody>
        </Table>
    </Page>;
}
