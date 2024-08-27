// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useApp } from '@/app';
import { DataTable } from '@/components';
import { Page } from '@/core';

interface Admin {
    id: number;
    no: string;
    created: string;
    state: string;
}

export default function(): JSX.Element {
    const ctx = useApp();

    return <DataTable queries={{}} columns={[
        {id: 'id',label: ctx.t('_internal.page.id')},
        {id: 'no',label: ctx.t('_internal.page.no')},
        {id: 'created',label: ctx.t('_internal.page.created')},
        {id: 'state',label: ctx.t('_internal.page.state')},
    ]} load={async() => {
        const ret = await ctx.get<Page<Admin>>('/admins');
        if (!ret.ok) {
            ctx.outputProblem(ret.status, ret.body);
            return [];
        }
        return ret.body;
    }} />;
}
