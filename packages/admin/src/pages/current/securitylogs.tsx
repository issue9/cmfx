// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Page, RemoteTable, TextField } from '@cmfx/components';
import { Query } from '@cmfx/core';
import Bowser from 'bowser';
import { JSX } from 'solid-js';

import { useAdmin } from '@/context';

interface SecurityLog {
    content: string;
    ip: string;
    ua: string;
    created: string;
}

export function SecurityLogs(): JSX.Element {
    const ctx = useAdmin();

    const q: Query = {
        page: 1,
        text: '',
        size: 20,
        //'created.start'?: string;
        //'created.end'?: string;
    };

    return <Page title="_i.page.current.securitylog">
        <RemoteTable<SecurityLog, Query> path='/securitylog' paging inSearch systemToolbar queries={q} columns={[
            { id: 'content', label: ctx.locale().t('_i.page.current.content') },
            { id: 'ip', label: ctx.locale().t('_i.page.current.ip') },
            { id: 'ua', label: ctx.locale().t('_i.page.current.ua'), content:(_: string, val?: string)=>{
                if (!val) { return ''; }
                const info = Bowser.parse(val);
                return ctx.locale().t('_i.page.current.uaInfo', {
                    browser: info.browser.name,
                    browserVersion: info.browser.version,
                    os: info.os.name,
                    osVersion: info.os.version,
                    kernel: info.engine.name,
                    kernelVersion: info.engine.version,
                });
            } },
            { id: 'created', label: ctx.locale().t('_i.page.created'), content:(_: string, val?: string)=>{
                return ctx.locale().datetime(val);
            } },
        ]} queryForm={(qa)=>(
            <>
                <TextField accessor={qa.accessor<string>('text')} />
            </>
        )} />
    </Page>;
}
