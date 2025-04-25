// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Divider, Form, FormAccessor, Icon, LinkButton, Page, TextField } from '@cmfx/components';
import { useNavigate, useParams } from '@solidjs/router';
import { createSignal, For, JSX, onMount } from 'solid-js';

import { useAdmin, User } from '@/context';
import { Passport, Sex, SexSelector } from '@/pages/common';
import { roles } from '@/pages/roles';

interface Props {
    /**
     * 返回上一页的地址
     */
    backURL: string;
}

export function Edit(props: Props): JSX.Element {
    const ctx = useAdmin();
    const ps = useParams<{id: string}>();

    const [passports, setPassports] = createSignal<Array<Passport>>([]);

    const nav = useNavigate();
    const form = new FormAccessor<Admin>(zeroAdmin(), ctx,
        async (obj) => { return await ctx.api.patch(`/admins/${ps.id}`, obj); },
        () => { nav(props.backURL); }
    );
    const formPassports = form.accessor<Admin['passports']>('passports');

    onMount(async () => {
        const r1 = await ctx.api.get<Admin>(`/admins/${ps.id}`);
        if (r1.ok) {
            form.setPreset(r1.body!);
            form.setObject(r1.body!);
        } else {
            await ctx.outputProblem(r1.body);
        }

        const r2 = await ctx.api.get<Array<Passport>>('/passports');
        if (!r2.ok) {
            await ctx.outputProblem(r2.body);
            return;
        }
        setPassports(r2.body!);
    });

    return <Page title="_i.page.admin.admin" class="max-w-xs">
        <Form formAccessor={form} class="flex flex-col">
            <TextField class='w-full' accessor={form.accessor<string>('name')} label={ctx.locale().t('_i.page.admin.name')} />
            <TextField class='w-full' accessor={form.accessor<string>('nickname')} label={ctx.locale().t('_i.page.nickname')} />
            <roles.Selector class="w-full" multiple accessor={form.accessor<Array<string>>('roles')} label={ctx.locale().t('_i.page.roles.roles')} />
            <SexSelector class='w-full' accessor={form.accessor<Sex>('sex')} label={ctx.locale().t('_i.page.sex')} />
            <div class="w-full flex justify-between gap-5">
                <LinkButton href={props.backURL} type="button" palette='secondary'>
                    <Icon icon='arrow_back_ios' />
                    {ctx.locale().t('_i.page.back')}
                </LinkButton>
                <Button disabled={form.isPreset()} type="reset" palette='secondary'>{ctx.locale().t('_i.reset')}</Button>
                <Button disabled={form.isPreset()} type="submit" palette='primary'>{ctx.locale().t('_i.ok')}</Button>
            </div>
        </Form>

        <Divider padding='8px'>{ctx.locale().t('_i.page.admin.passport')}</Divider>

        <fieldset class="c--table">
            <table>
                <thead>
                    <tr>
                        <th>{ctx.locale().t('_i.page.admin.passportType')}</th>
                        <th>{ctx.locale().t('_i.page.current.username')}</th>
                    </tr>
                </thead>
                <tbody>
                    <For each={passports()}>
                        {(item) => {
                            const uid = formPassports.getValue()!.find((v) => v.id == item.id)?.id;
                            return <tr>
                                <td class="flex items-center">
                                    {item.id}
                                    <Icon icon='help' title={item.desc} class="ml-1 cursor-help" />
                                </td>
                                <td>{uid}</td>
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
