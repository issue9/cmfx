// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Form, FormAccessor, LinkButton, notify, Page, Password, TextField } from '@cmfx/components';
import { useNavigate } from '@solidjs/router';
import { JSX } from 'solid-js';
import IconArrowBack from '~icons/material-symbols/arrow-back-ios';

import { user } from '@/components';
import { use, useLocale } from '@/context';
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
        await notify(l.t('_p.admin.addSuccessful'), undefined, 'success');
        useNavigate()(-1);
    });

    return <Page title="_p.admin.admin" class="max-w-xs">
        <Form formAccessor={form} class="flex flex-col">
            <TextField class='w-full' accessor={form.accessor<string>('username')} label={l.t('_p.current.username')} />
            <TextField class='w-full' accessor={form.accessor<string>('name')} label={l.t('_p.admin.name')} />
            <TextField class='w-full' accessor={form.accessor<string>('nickname')} label={l.t('_p.nickname')} />
            <Password class='w-full' autocomplete='new-password' accessor={form.accessor<string>('password')} label={l.t('_p.current.password')} />
            <roles.Selector class="w-full" multiple accessor={form.accessor<Array<string>>('roles')} label={l.t('_p.roles.roles')} />
            <user.SexSelector class='w-full' accessor={form.accessor<user.Sex>('sex')} />
            <div class="w-full flex justify-between gap-5">
                <LinkButton href={props.backURL} palette='secondary'>
                    <IconArrowBack />{l.t('_c.cancel')}
                </LinkButton>
                <Button type="submit" palette='primary'>{l.t('_c.ok')}</Button>
            </div>
        </Form>
    </Page>;
}

interface Admin {
    sex: user.Sex;
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
