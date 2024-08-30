// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useApp } from '@/app';
import { Button, ConfirmButton, RemoteTable } from '@/components';

interface Role {
    id?: number;
    name: string;
    description: string;
}

export default function(): JSX.Element {
    const ctx = useApp();

    return <RemoteTable queries={{}} systemToolbar columns={[
        {id: 'id',label: ctx.t('_i.page.id')},
        {id: 'name',label: ctx.t('_i.page.roles.name')},
        {id: 'description',label: ctx.t('_i.page.roles.description')},
        {id: 'actions',label: ctx.t('_i.page.actions'), renderContent:(id, val, obj)=><div class="flex gap-x-2">
            <Button icon rounded palette='tertiary' title={ctx.t('_i.page.editItem')}>edit</Button>
            <ConfirmButton icon rounded pos="bottomright" palette='error' title={ctx.t('_i.page.deleteItem')} onClick={async()=>{
                const ret = await ctx.delete(`/admins/${obj!['id']}`);
                if (!ret.ok) {
                    ctx.outputProblem(ret.status, ret.body);
                    return;
                }
                // TODO
            }}>delete</ConfirmButton>
        </div>},
    ]} toolbar={
        <Button palette='primary' onClick={()=>alert('TODO')}>{ctx.t('_i.page.newItem')}</Button>
    } load={async() => {
        const ret = await ctx.get<Array<Role>>('/roles');
        if (!ret.ok) {
            ctx.outputProblem(ret.status, ret.body);
            return [];
        }

        return ret.body;
    }} />;
}
