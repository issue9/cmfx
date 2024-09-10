// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useApp } from '@/app';
import {
    Button, Column, Dialog, DialogMethods, LinkButton, ObjectAccessor,
    Page, RemoteTable, RemoteTableMethods, TextArea, TextField
} from '@/components';
import { Return } from '@/core';

interface Role {
    id?: string;
    name: string;
    description: string;
    parent?: string;
}

interface Props {
    /**
     * 路由基地址
     */
    routePrefix: string;
}

export default function Roles(props: Props): JSX.Element {
    const ctx = useApp();
    let tableRef: RemoteTableMethods<Role>;
    let dialogRef: DialogMethods;
    const current = new ObjectAccessor({} as Role);
    const currentID = current.accessor('id');

    ctx.cacheAPI('/roles','/roles/*');

    // 保存数据
    const save = async (): Promise<undefined> => {
        let ret: Return<Role, never>;
        const id = currentID.getValue();

        const obj = current.object();
        delete obj.id;
        if (id) {
            ret = await ctx.put(`/roles/${id}`, obj);
        } else {
            ret = await ctx.post('/roles', obj);
        }

        if (!ret.ok) {
            await ctx.outputProblem(ret.status, ret.body);
            return;
        }
        tableRef.refresh();
    };

    const edit = (id: string) => {
        if (id) {
            const curr = tableRef.items()!.find((v) => v.id === id);
            current.accessor('id').setValue(id);
            current.accessor('name').setValue(curr!.name);
            current.accessor('description').setValue(curr!.description);
            current.accessor('parent').setValue(curr!.parent);
        } else {
            current.accessor('id').setValue('');
            current.accessor('name').setValue('');
            current.accessor('description').setValue('');
            current.accessor('parent').setValue('');
        }

        dialogRef.showModal();
    };

    return <Page title="_i.page.roles.rolesManager" class="max-w-lg">
        <Dialog ref={(el)=>dialogRef=el}
            header={currentID.getValue() ? ctx.t('_i.page.editItem') : ctx.t('_i.page.newItem')}
            actions={dialogRef!.DefaultActions(save)}
        >
            <form class="flex flex-col gap-2">
                <TextField accessor={current.accessor<string>('name')} />
                <TextArea accessor={current.accessor<string>('description')} />
            </form>
        </Dialog>
        <RemoteTable ref={(el) => tableRef = el} path='/roles' queries={{}} systemToolbar columns={[
            { id: 'id', label: ctx.t('_i.page.id') },
            { id: 'name', label: ctx.t('_i.page.roles.name') },
            { id: 'description', label: ctx.t('_i.page.roles.description') },
            {
                id: 'actions', label: ctx.t('_i.page.actions'), renderContent: ((_, __, obj) => <div class="flex gap-x-2">
                    <Button icon rounded palette='tertiary' onClick={()=>edit(obj!['id']!)} title={ctx.t('_i.page.editItem')}>edit</Button>
                    <LinkButton icon rounded palette='tertiary' href={`${props.routePrefix}/${obj!['id']}/permission`} title={ctx.t('_i.page.roles.editPermission')}>passkey</LinkButton>
                    {tableRef.DeleteAction(obj!['id']!)}
                </div>) as Column<Role>['renderContent']
            },
        ]} toolbar={
            <Button palette='primary' onClick={() => edit('')}>{ctx.t('_i.page.newItem')}</Button>
        } />
    </Page>;
}
