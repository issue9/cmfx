// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useApp } from '@/app';
import { Button, Column, Page, RemoteTable, RemoteTableMethods } from '@/components';

interface Role {
    id?: string;
    name: string;
    description: string;
}

export default function(): JSX.Element {
    const ctx = useApp();
    let ref: RemoteTableMethods;

    return <Page title="_i.page.roles.rolesManager">
        <RemoteTable ref={(el) => ref = el} path='/roles' queries={{}} systemToolbar columns={[
            { id: 'id', label: ctx.t('_i.page.id') },
            { id: 'name', label: ctx.t('_i.page.roles.name') },
            { id: 'description', label: ctx.t('_i.page.roles.description') },
            {
                id: 'actions', label: ctx.t('_i.page.actions'), renderContent: ((id, _, obj) => <div class="flex gap-x-2">
                    <Button icon rounded palette='tertiary' title={ctx.t('_i.page.editItem')}>edit</Button>
                    <Button icon rounded palette='tertiary' title={ctx.t('_i.page.roles.editPermission')}>passkey</Button>
                    {ref.DeleteAction(obj!['id']!)}
                </div>) as Column<Role>['renderContent']
            },
        ]} toolbar={
            <Button palette='primary' onClick={() => alert('TODO')}>{ctx.t('_i.page.newItem')}</Button>
        } />
    </Page>;
}
