// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, createForm, Divider, Page, Table, TextField, useLocale } from '@cmfx/components';
import { useNavigate, useParams } from '@solidjs/router';
import { createSignal, For, JSX, onMount } from 'solid-js';
import * as z from 'zod';
import IconArrowBack from '~icons/material-symbols/arrow-back-ios';
import IconHelp from '~icons/material-symbols/help';

import { Passport, SexSelector } from '@/components';
import { Sex, sexSchema, useAdmin } from '@/context';
import { passportSchema } from '@/context/user';
import { roles } from '@/pages/roles';

interface Props {
    /**
     * 返回上一页的地址
     */
    backURL: string;
}

const adminSchema = z.object({
    sex: sexSchema,
    name: z.string().min(1),
    nickname: z.string().min(1),
    roles: z.array(z.string().min(1)),
    passports: z.array(passportSchema)
});

type Admin = z.infer<typeof adminSchema>;

export function Edit(props: Props): JSX.Element {
    const [api, act] = useAdmin();
    const l = useLocale();
    const ps = useParams<{id: string}>();

    const [passports, setPassports] = createSignal<Array<Passport>>([]);

    const nav = useNavigate();
    const [fapi, Form] = createForm<Admin>({
        initValue: {sex: 'unknown', name: '', nickname: '', roles: [], passports: []},
        submit: async obj => { return await api.patch(`/admins/${ps.id}`, obj); },
        onProblem: act.handleProblem,
        onSuccess: () => nav(props.backURL)
    });

    onMount(async () => {
        const r1 = await api.get<Admin>(`/admins/${ps.id}`);
        if (r1.ok) {
            fapi.setPreset(r1.body!);
            fapi.setValue(r1.body!);
        } else {
            await act.handleProblem(r1.body);
        }

        const r2 = await api.get<Array<Passport>>('/passports');
        if (!r2.ok) {
            await act.handleProblem(r2.body);
            return;
        }
        setPassports(r2.body!);
    });

    return <Page title="_p.admin.admin" class="max-w-2xl">
        <Form class="flex flex-col">
            <TextField class='w-full' accessor={fapi.accessor<string>('name')} label={l.t('_p.admin.name')} />
            <TextField class='w-full' accessor={fapi.accessor<string>('nickname')} label={l.t('_p.nickname')} />
            <roles.Selector class="w-full" multiple accessor={fapi.accessor<Array<string>>('roles')} label={l.t('_p.roles.roles')} />
            <SexSelector class='w-full' accessor={fapi.accessor<Sex>('sex')} label={l.t('_p.sex')} />
            <div class="w-full flex justify-between gap-5">
                <Button type='a' href={props.backURL} palette='secondary'>
                    <IconArrowBack />
                    {l.t('_p.back')}
                </Button>
                <Button disabled={fapi.isPreset()} type="reset" palette='secondary'>{l.t('_c.reset')}</Button>
                <Button disabled={fapi.isPreset()} type="submit" palette='primary'>{l.t('_c.ok')}</Button>
            </div>
        </Form>

        <Divider padding='8px'>{l.t('_p.admin.passport')}</Divider>

        <Table hoverable>
            <thead>
                <tr>
                    <th>{l.t('_p.admin.passportType')}</th>
                    <th>{l.t('_p.current.username')}</th>
                </tr>
            </thead>
            <tbody>
                <For each={passports()}>
                    {(item) => {
                        const uid = fapi.accessor<Admin['passports']>('passports').getValue()!.find(v => v.id == item.id)?.id;
                        return <tr>
                            <td class="flex items-center">
                                {item.id}
                                <span class="ms-1 cursor-help" title={item.desc}><IconHelp /></span>
                            </td>
                            <td>{uid}</td>
                        </tr>;
                    }}
                </For>
            </tbody>
        </Table>
    </Page>;
}
