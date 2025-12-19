// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, createForm, notify, useLocale, Page, Password, TextField } from '@cmfx/components';
import { useNavigate } from '@solidjs/router';
import { JSX } from 'solid-js';
import * as z from 'zod';
import IconArrowBack from '~icons/material-symbols/arrow-back-ios';

import { SexSelector } from '@/components';
import { Sex, sexSchema, useAdmin } from '@/context';
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
    username: z.string().min(1),
    password: z.string().min(1),
});

export function New(props: Props): JSX.Element {
    const [api, act] = useAdmin();
    const l = useLocale();

    const [fapi, Form] = createForm({
        initValue: adminSchema.parse({ sex: 'unknown' }),
        submit: async obj => { return await api.post('/admins', obj); },
        onProblem: async p => act.handleProblem(p),
        onSuccess: async () => {
            await notify(l.t('_p.admin.addSuccessful'), undefined, 'success');
            useNavigate()(-1);
        }
    });

    return <Page title="_p.admin.admin" class="max-w-2xl">
        <Form class="flex flex-col">
            <TextField class='w-full' accessor={fapi.accessor<string>('username')} label={l.t('_p.current.username')} />
            <TextField class='w-full' accessor={fapi.accessor<string>('name')} label={l.t('_p.admin.name')} />
            <TextField class='w-full' accessor={fapi.accessor<string>('nickname')} label={l.t('_p.nickname')} />
            <Password class='w-full' autocomplete='new-password' accessor={fapi.accessor<string>('password')} label={l.t('_p.current.password')} />
            <roles.Selector class="w-full" multiple accessor={fapi.accessor<Array<string>>('roles')} label={l.t('_p.roles.roles')} />
            <SexSelector class='w-full' accessor={fapi.accessor<Sex>('sex')} />
            <div class="w-full flex justify-between gap-5">
                <Button type='a' href={props.backURL} palette='secondary'>
                    <IconArrowBack />{l.t('_c.cancel')}
                </Button>
                <Button type="submit" palette='primary'>{l.t('_c.ok')}</Button>
            </div>
        </Form>
    </Page>;
}
