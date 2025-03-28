// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Button, Form, FormAccessor, Icon, LinkButton, Page, Password, TextField } from '@/components';
import { useApp } from '@/context';
import { Sex, SexSelector } from '@/pages/common';
import { roles } from '@/pages/roles';

interface Props {
    /**
     * 返回上一页的地址
     */
    backURL: string;
}

export function New(props: Props): JSX.Element {
    const ctx = useApp();

    const form = new FormAccessor<Admin>(zeroAdmin(), ctx, async (obj) => {
        return await ctx.api.post('/admins', obj);
    }, async () => {
        await ctx.notify(ctx.locale().t('_i.page.admin.addSuccessful'), undefined, 'success');
        ctx.navigate()(-1);
    });

    return <Page title="_i.page.admin.admin" class="max-w-xs">
        <Form formAccessor={form} class="flex flex-col">
            <TextField class='w-full' accessor={form.accessor<string>('username')} label={ctx.locale().t('_i.page.current.username')} />
            <TextField class='w-full' accessor={form.accessor<string>('name')} label={ctx.locale().t('_i.page.admin.name')} />
            <TextField class='w-full' accessor={form.accessor<string>('nickname')} label={ctx.locale().t('_i.page.current.nickname')} />
            <Password class='w-full' autocomplete='new-password' accessor={form.accessor<string>('password')} label={ctx.locale().t('_i.page.current.password')} />
            <roles.Selector class="w-full" multiple accessor={form.accessor<Array<string>>('roles')} label={ctx.locale().t('_i.page.roles.roles')} />
            <SexSelector class='w-full' accessor={form.accessor<Sex>('sex')} />
            <div class="w-full flex justify-between gap-5">
                <LinkButton href={props.backURL} palette='secondary'>
                    <Icon icon='arrow_back_ios' />
                    {ctx.locale().t('_i.cancel')}
                </LinkButton>
                <Button type="submit" palette='primary'>{ctx.locale().t('_i.ok')}</Button>
            </div>
        </Form>
    </Page>;
}

interface Admin {
    sex: Sex;
    name: string;
    nickname: string;
    roles: Array<string>;
    username: string;
    password: string;
}

export function zeroAdmin(): Admin {
    return {
        sex: 'unknown',
        name: '',
        nickname: '',
        roles: [],
        username: '',
        password: '',
    };
}
