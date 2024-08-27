// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useApp } from '@/app';
import { Button, DataTable } from '@/components';

interface Role {
    id?: number;
    name: string;
    description: string;
}

export default function(): JSX.Element {
    const ctx = useApp();

    return <DataTable queries={{}} systemToolbar columns={[
        {id: 'id',label: ctx.t('_internal.page.id')},
        {id: 'name',label: ctx.t('_internal.page.roles.name')},
        {id: 'description',label: ctx.t('_internal.page.roles.description')},
        {id: 'actions',label: ctx.t('_internal.page.actions'), render:()=><>
            <Button palette='secondary'>{ ctx.t('_internal.page.edit') }</Button>
        </>},
    ]} toolbar={
        <Button palette='primary' onClick={()=>alert('TODO')}>{ctx.t('_internal.page.newItem')}</Button>
    } load={async() => {
        const ret = await ctx.get<Array<Role>>('/roles');
        if (!ret.ok) {
            ctx.outputProblem(ret.status, ret.body);
            return [];
        }

        return ret.body;
    }} />;
}
