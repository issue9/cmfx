// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { JSX } from 'solid-js';
import { unwrap } from 'solid-js/store';

import { useApp } from '@/app';
import { Button, Form, FormAccessor, Page, Password, TextField } from '@/components';
import { roles } from '@/pages/roles';
import { SexSelector } from './selector';
import { Admin, Sex, zeroAdmin } from './types';

export default function(): JSX.Element {
    const ctx = useApp();
    const nav = useNavigate();

    const form = new FormAccessor<Admin>(zeroAdmin(), ctx, async (obj) => {
        const o = unwrap(obj);
        delete o.id;
        delete o.created;
        return await ctx.api.post('/admins', obj);
    }, () => {
        ctx.notify(ctx.locale().t('_i.page.admin.addSuccessful'), undefined, 'success');
        nav(-1);
    });

    return <Page title="_i.page.admin.admin" class="max-w-xs">
        <Form formAccessor={form} class="flex flex-col">
            <TextField class='w-full' accessor={form.accessor<string>('username')} label={ctx.locale().t('_i.page.current.username')} />
            <TextField class='w-full' accessor={form.accessor<string>('name')} label={ctx.locale().t('_i.page.admin.name')} />
            <TextField class='w-full' accessor={form.accessor<string>('nickname')} label={ctx.locale().t('_i.page.admin.nickname')} />
            <Password class='w-full' autocomplete='new-password' accessor={form.accessor<string>('password')} label={ctx.locale().t('_i.page.current.password')} />
            <roles.Selector class="w-full" multiple accessor={form.accessor<Array<string>>('roles')} label={ctx.locale().t('_i.page.roles.roles')} />
            <SexSelector class='w-full' accessor={form.accessor<Sex>('sex')} />
            <div class="w-full flex justify-end gap-5">
                <Button type="button" palette='secondary' onClick={()=>nav(-1)}>{ctx.locale().t('_i.cancel')}</Button>
                <Button type="submit" palette='primary'>{ctx.locale().t('_i.ok')}</Button>
            </div>
        </Form>
    </Page>;
}
