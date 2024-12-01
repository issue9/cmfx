// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useParams } from '@solidjs/router';
import { createSignal, For, JSX, onMount } from 'solid-js';

import { useApp, User } from '@/app';
import { Button, Divider, Form, FormAccessor, Icon, Page, TextField } from '@/components';
import { Passport } from '@/pages/current/passport';
import { roles } from '@/pages/roles';
import { Sex, SexSelector } from './selector';

export default function(): JSX.Element {
    const ctx = useApp();
    const ps = useParams<{id: string}>();

    const [passports, setPassports] = createSignal<Array<Passport>>([]);

    const form = new FormAccessor<Admin>(zeroAdmin(), ctx, async(obj)=>{
        return await ctx.api.patch(`/admins/${ps.id}`, obj);
    });
    const formPassports = form.accessor<Admin['passports']>('passports');


    onMount(async () => {
        const r1 = await ctx.api.get<Admin>(`/admins/${ps.id}`);
        if (r1.ok) {
            form.setPreset(r1.body!);
            form.setObject(r1.body!);
        } else {
            ctx.outputProblem(r1.body);
        }

        const r2 = await ctx.api.get<Array<Passport>>('/passports');
        if (!r2.ok) {
            ctx.outputProblem(r2.body);
            return;
        }
        setPassports(r2.body!);
    });

    return <Page title="_i.page.admin.admin" class="max-w-xs">
        <Form formAccessor={form} class="flex flex-col">
            <TextField class='w-full' accessor={form.accessor<string>('name')} label={ctx.locale().t('_i.page.admin.name')} />
            <TextField class='w-full' accessor={form.accessor<string>('nickname')} label={ctx.locale().t('_i.page.admin.nickname')} />
            <roles.Selector class="w-full" multiple accessor={form.accessor<Array<string>>('roles')} label={ctx.locale().t('_i.page.roles.roles')} />
            <SexSelector class='w-full' accessor={form.accessor<Sex>('sex')} label={ctx.locale().t('_i.page.sex')} />
            <div class="w-full flex justify-end gap-5">
                <Button disabled={form.isPreset()} type="reset" palette='secondary'>{ctx.locale().t('_i.reset')}</Button>
                <Button disabled={form.isPreset()} type="submit" palette='primary'>{ctx.locale().t('_i.ok')}</Button>
            </div>
        </Form>

        <Divider padding='8px'>{ctx.locale().t('_i.page.admin.passport')}</Divider>

        <fieldset class="c--table">
            <table>
                <thead>
                    <tr>
                        <th>{ctx.locale().t('_i.page.admin.passportTtype')}</th>
                        <th>{ctx.locale().t('_i.page.current.username')}</th>
                    </tr>
                </thead>
                <tbody>
                    <For each={passports()}>
                        {(item) => {
                            const username = formPassports.getValue()!.find((v) => v.id == item.id)?.username;
                            return <tr>
                                <td class="flex items-center">
                                    {item.id}
                                    <Icon icon='help' title={item.desc} class="ml-1 cursor-help" />
                                </td>
                                <td>{username}</td>
                            </tr>;
                        }}
                    </For>
                </tbody>
            </table>
        </fieldset>
    </Page>;
}

interface Admin {
    sex: Sex;
    name: string;
    nickname: string;
    roles: Array<string>;
    passports?: User['passports'];
}

function zeroAdmin(): Admin {
    return {
        sex: 'unknown',
        name: '',
        nickname: '',
        roles: [],
        passports: [],
    };
}
