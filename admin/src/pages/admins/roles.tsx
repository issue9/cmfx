// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useApp } from '@/app';
import { Column, DataTable } from '@/components';

interface Role {
    id?: number;
    name: string;
    description: string;
}

export default function(): JSX.Element {
    const ctx = useApp();

    const columns: Array<Column<Role>> = [
        {
            id: 'id',
            label: 'ID',
        },
        {
            id: 'name',
            label: 'name',
        },
        {
            id: 'description',
            label: 'description',
        },
    ];

    return <DataTable columns={columns} queries={{}} load={async() => {
        const ret = await ctx.get<Array<Role>>('/roles');
        if (!ret.ok) {
            ctx.outputProblem(ret.status, ret.body);
            return [];
        }

        return ret.body;
    }} />;
}
