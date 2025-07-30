// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Divider, Form, FormAccessor, LinkButton, Page, TextField } from '@cmfx/components';
import { useNavigate, useParams } from '@solidjs/router';
import { createSignal, For, JSX, onMount } from 'solid-js';
import IconArrowBack from '~icons/material-symbols/arrow-back-ios';
import IconHelp from '~icons/material-symbols/help';

import { user } from '@/components';
import { use, useLocale, User } from '@/context';
import { roles } from '@/pages/roles';

interface Props {
    /**
     * 返回上一页的地址
     */
    backURL: string;
}

export function Edit(props: Props): JSX.Element {
    const [api, act] = use();
    const l = useLocale();
    const ps = useParams<{id: string}>();

    const [passports, setPassports] = createSignal<Array<user.Passport>>([]);

    const nav = useNavigate();
    const form = new FormAccessor<Admin>(zeroAdmin(),
        async (obj) => { return await api.patch(`/admins/${ps.id}`, obj); },
        act.outputProblem,
        () => { nav(props.backURL); }
    );
    const formPassports = form.accessor<Admin['passports']>('passports');

    onMount(async () => {
        const r1 = await api.get<Admin>(`/admins/${ps.id}`);
        if (r1.ok) {
            form.setPreset(r1.body!);
            form.setObject(r1.body!);
        } else {
            await act.outputProblem(r1.body);
        }

        const r2 = await api.get<Array<user.Passport>>('/passports');
        if (!r2.ok) {
            await act.outputProblem(r2.body);
            return;
        }
        setPassports(r2.body!);
    });

    return <Page title="_p.admin.admin" class="max-w-xs">
        <Form formAccessor={form} class="flex flex-col">
            <TextField class='w-full' accessor={form.accessor<string>('name')} label={l.t('_p.admin.name')} />
            <TextField class='w-full' accessor={form.accessor<string>('nickname')} label={l.t('_p.nickname')} />
            <roles.Selector class="w-full" multiple accessor={form.accessor<Array<string>>('roles')} label={l.t('_p.roles.roles')} />
            <user.SexSelector class='w-full' accessor={form.accessor<user.Sex>('sex')} label={l.t('_p.sex')} />
            <div class="w-full flex justify-between gap-5">
                <LinkButton href={props.backURL} type="button" palette='secondary'>
                    <IconArrowBack />
                    {l.t('_p.back')}
                </LinkButton>
                <Button disabled={form.isPreset()} type="reset" palette='secondary'>{l.t('_c.reset')}</Button>
                <Button disabled={form.isPreset()} type="submit" palette='primary'>{l.t('_c.ok')}</Button>
            </div>
        </Form>

        <Divider padding='8px'>{l.t('_p.admin.passport')}</Divider>

        <table class="cmfx-table">
            <thead>
                <tr>
                    <th>{l.t('_p.admin.passportType')}</th>
                    <th>{l.t('_p.current.username')}</th>
                </tr>
            </thead>
            <tbody>
                <For each={passports()}>
                    {(item) => {
                        const uid = formPassports.getValue()!.find((v) => v.id == item.id)?.id;
                        return <tr>
                            <td class="flex items-center">
                                {item.id}
                                <span class="ml-1 cursor-help" title={item.desc}><IconHelp /></span>
                            </td>
                            <td>{uid}</td>
                        </tr>;
                    }}
                </For>
            </tbody>
        </table>
    </Page>;
}

type Admin = {
    sex: user.Sex;
    name: string;
    nickname: string;
    roles: Array<string>;
    passports?: User['passports'];
};

function zeroAdmin(): Admin {
    return {
        sex: 'unknown',
        name: '',
        nickname: '',
        roles: [],
        passports: [],
    };
}
