// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Form, FormAccessor, Icon, LinkButton, notify, Page, Password, TextField } from '@cmfx/components';
import { useNavigate } from '@solidjs/router';
import { JSX } from 'solid-js';

import { use, useLocale } from '@/context';
import { Sex, SexSelector } from '@/pages/common';
import { roles } from '@/pages/roles';

interface Props {
    /**
     * 返回上一页的地址
     */
    backURL: string;
}

export function New(props: Props): JSX.Element {
    const [api, act] = use();
    const l = useLocale();

    const form = new FormAccessor<Admin>(zeroAdmin(), act, async (obj) => {
        return await api.post('/admins', obj);
    }, async () => {
        await notify(l.t('_i.page.admin.addSuccessful'), undefined, 'success');
        useNavigate()(-1);
    });

    return <Page title="_i.page.admin.admin" class="max-w-xs">
        <Form formAccessor={form} class="flex flex-col">
            <TextField class='w-full' accessor={form.accessor<string>('username')} label={l.t('_i.page.current.username')} />
            <TextField class='w-full' accessor={form.accessor<string>('name')} label={l.t('_i.page.admin.name')} />
            <TextField class='w-full' accessor={form.accessor<string>('nickname')} label={l.t('_i.page.current.nickname')} />
            <Password class='w-full' autocomplete='new-password' accessor={form.accessor<string>('password')} label={l.t('_i.page.current.password')} />
            <roles.Selector class="w-full" multiple accessor={form.accessor<Array<string>>('roles')} label={l.t('_i.page.roles.roles')} />
            <SexSelector class='w-full' accessor={form.accessor<Sex>('sex')} />
            <div class="w-full flex justify-between gap-5">
                <LinkButton href={props.backURL} palette='secondary'>
                    <Icon icon='arrow_back_ios' />
                    {l.t('_i.cancel')}
                </LinkButton>
                <Button type="submit" palette='primary'>{l.t('_i.ok')}</Button>
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
