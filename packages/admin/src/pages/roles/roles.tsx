// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Button, Column, Dialog, DialogRef, LinkButton, ObjectAccessor,
    Page, RemoteTable, RemoteTableRef, TextArea, TextField
} from '@cmfx/components';
import { Return } from '@cmfx/core';
import { JSX } from 'solid-js';
import IconEdit from '~icons/material-symbols/edit';
import IconPasskey from '~icons/material-symbols/passkey';

import { use, useLocale } from '@/context';

export interface Role {
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

export function Roles(props: Props): JSX.Element {
    const [api, act] = use();
    const l = useLocale();
    let tableRef: RemoteTableRef<Role>;
    let dialogRef: DialogRef;
    const current = new ObjectAccessor({} as Role);
    const currentID = current.accessor('id');

    api.cache('/roles','/roles/*');

    // 保存数据
    const save = async (): Promise<undefined> => {
        let ret: Return<Role, never>;
        const id = currentID.getValue();

        const obj = current.object();
        delete obj.id;
        if (id) {
            ret = await api.put(`/roles/${id}`, obj);
        } else {
            ret = await api.post('/roles', obj);
        }

        if (!ret.ok) {
            await act.outputProblem(ret.body);
            return;
        }
        await tableRef.refresh();
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

    return <Page title="_p.roles.rolesManager" class="max-w-lg">
        <Dialog ref={(el)=>dialogRef=el}
            header={currentID.getValue() ? l.t('_p.editItem') : l.t('_p.newItem')}
            actions={dialogRef!.DefaultActions(save)}
        >
            <form class="flex flex-col gap-2">
                <TextField accessor={current.accessor<string>('name')} />
                <TextArea accessor={current.accessor<string>('description')} />
            </form>
        </Dialog>
        <RemoteTable ref={(el) => tableRef = el} path='/roles' queries={{}} systemToolbar columns={[
            { id: 'id', label: l.t('_p.id') },
            { id: 'name', label: l.t('_p.roles.name') },
            { id: 'description', label: l.t('_p.roles.description') },
            {
                id: 'actions', cellClass: 'no-print', label: l.t('_p.actions'), renderContent: ((_, __, obj) => <div class="flex gap-x-2">
                    <Button square rounded palette='tertiary' onClick={()=>edit(obj!['id']!)} title={l.t('_p.editItem')}><IconEdit /></Button>
                    <LinkButton square rounded palette='tertiary' href={`${props.routePrefix}/${obj!['id']}/permission`} title={l.t('_p.roles.editPermission')}><IconPasskey /></LinkButton>
                    {tableRef.DeleteAction(obj!['id']!)}
                </div>) as Column<Role>['renderContent']
            },
        ]} toolbar={
            <Button palette='primary' onClick={() => edit('')}>{l.t('_p.newItem')}</Button>
        } />
    </Page>;
}
