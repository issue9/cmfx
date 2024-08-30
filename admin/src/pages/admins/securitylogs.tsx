// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { SetParams } from '@solidjs/router';

import { useApp } from '@/app';
import { RemoteTable } from '@/components';
import { Page } from '@/core';

interface SecurityLog {
    content: string;
    ip: string;
    ua: string;
    created: string;
}

interface Query extends SetParams {
    text?: string;
    'created.start'?: string;
    'created.end'?: string;
}

export default function() {
    const ctx = useApp();

    const q: Query = {
        page: 1,
    };

    return <RemoteTable paging queries={q} columns={[
        {id: 'content',label: ctx.t('_i.page.securitylog.content')},
        {id: 'ip',label: ctx.t('_i.page.securitylog.ip')},
        {id: 'ua',label: ctx.t('_i.page.securitylog.ua')},
        {id: 'created',label: ctx.t('_i.page.created')},
    ]} load={async () => {
        const ret = await ctx.get<Page<SecurityLog>>('/securitylog');
        if (!ret.ok) {
            ctx.outputProblem(ret.status, ret.body);
            return {current: [], count: 0};
        }
        return ret.body;
    }} />;
}
