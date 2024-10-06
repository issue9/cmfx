// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import Bowser from 'bowser';

import { useApp } from '@/app';
import { Page, RemoteTable, TextField } from '@/components';
import { Query } from '@/core';

interface SecurityLog {
    content: string;
    ip: string;
    ua: string;
    created: string;
}

export default function() {
    const ctx = useApp();

    const q: Query = {
        page: 1,
        text: '',
        //'created.start'?: string;
        //'created.end'?: string;
    };

    return <Page title="_i.page.current.securitylog">
        <RemoteTable path='/securitylog' paging inSearch systemToolbar queries={q} columns={[
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
                    kernal: info.engine.name,
                    kernalVersion: info.engine.version,
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
