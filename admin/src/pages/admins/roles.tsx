// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useApp } from '@/app';
import { Button, Column, Dialog, ObjectAccessor, Page, RemoteTable, RemoteTableMethods, TextArea, TextField } from '@/components';

interface Role {
    id?: string;
    name: string;
    description: string;
    parent?: string;
}

export default function(): JSX.Element {
    const ctx = useApp();
    let tableRef: RemoteTableMethods;
    let dialogRef: HTMLDialogElement;
    const current = new ObjectAccessor<Role>({} as Role);

    return <Page title="_i.page.roles.rolesManager">
        <Dialog ref={(el)=>dialogRef=el} header="HEADER TODO">
            <form>
                <TextField accessor={current.accessor<string>('name')} />
                <TextArea accessor={current.accessor<string>('description')} />
            </form>
        </Dialog>
        <RemoteTable ref={(el) => tableRef = el} path='/roles' queries={{}} systemToolbar columns={[
            { id: 'id', label: ctx.t('_i.page.id') },
            { id: 'name', label: ctx.t('_i.page.roles.name') },
            { id: 'description', label: ctx.t('_i.page.roles.description') },
            {
                id: 'actions', label: ctx.t('_i.page.actions'), renderContent: ((id, _, obj) => <div class="flex gap-x-2">
                    <Button icon rounded palette='tertiary' title={ctx.t('_i.page.editItem')}>edit</Button>
                    <Button icon rounded palette='tertiary' title={ctx.t('_i.page.roles.editPermission')}>passkey</Button>
                    {tableRef.DeleteAction(obj!['id']!)}
                </div>) as Column<Role>['renderContent']
            },
        ]} toolbar={
            <Button palette='primary' onClick={() => dialogRef.showModal()}>{ctx.t('_i.page.newItem')}</Button>
        } />
    </Page>;
}
