// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useApp } from '@/app';
import { Page, RemoteTable } from '@/components';
import { Query } from '@/core';

interface SecurityLog {
    content: string;
    ip: string;
    ua: string;
    created: string;
}

interface Q extends Query {
    text?: string;
    'created.start'?: string;
    'created.end'?: string;
}

export default function() {
    const ctx = useApp();

    const q: Q = {
        page: 1,
    };

    return <Page title="_i.page.securitylog.securitylog">
        <RemoteTable<SecurityLog, Q> path='/securitylog' paging queries={q} columns={[
            { id: 'content', label: ctx.locale().t('_i.page.securitylog.content') },
            { id: 'ip', label: ctx.locale().t('_i.page.securitylog.ip') },
            { id: 'ua', label: ctx.locale().t('_i.page.securitylog.ua') },
            { id: 'created', label: ctx.locale().t('_i.page.created') },
        ]} />
    </Page>;
}
