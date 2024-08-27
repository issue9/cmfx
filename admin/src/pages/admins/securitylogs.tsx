// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useApp } from '@/app';
import { DataTable } from '@/components';
import { Page } from '@/core';
import { SetParams } from '@solidjs/router';

interface SecurityLog {
    content: string;
    ip: string;
    ua: string;
    created: string;
}

interface Query extends SetParams {
    size: number;
    page: number;
    text?: string;
    'created.start'?: string;
    'created.end'?: string;
}

export default function() {
    const ctx = useApp();

    const q: Query = {
        page: 1,
    };

    return <DataTable paging queries={q} columns={[
        {id: 'content',label: ctx.t('_internal.page.securitylog.content')},
        {id: 'ip',label: ctx.t('_internal.page.securitylog.ip')},
        {id: 'ua',label: ctx.t('_internal.page.securitylog.ua')},
        {id: 'created',label: ctx.t('_internal.page.created')},
    ]} load={async () => {
        const ret = await ctx.get<Page<SecurityLog>>('/securitylog');
        if (!ret.ok) {
            ctx.outputProblem(ret.status, ret.body);
            return [];
        }
        return ret.body;
    }} />;
}
