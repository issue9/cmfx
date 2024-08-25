// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useApp } from '@/app';
import { Column, DataTable } from '@/components';
import { Page } from '@/core';

interface Admin {
    id: number;
    no: string;
    created: string;
    state: string;
}

export default function(): JSX.Element {
    const ctx = useApp();

    const columns: Array<Column<Admin>> = [
        {
            id: 'id',
            label: 'ID',
        },
        {
            id: 'no',
            label: 'NO',
        },
        {
            id: 'created',
            label: '添加时间',
        },
        {
            id: 'state',
            label: '状态',
        },
    ];

    return <DataTable columns={columns} queries={{}} load={async() => {
        const ret = await ctx.get<Page<Admin>>('/admins');
        if (!ret.ok) {
            ctx.outputProblem(ret.status, ret.body);
            return [];
        }
        return ret.body;
    }} />;
}
