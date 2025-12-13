// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Page, RemoteTable, TextField } from '@cmfx/components';
import { Query as Q } from '@cmfx/core';
import Bowser from 'bowser';
import { JSX } from 'solid-js';

import { useAdmin, useLocale } from '@/context';

type SecurityLog = {
    content: string;
    ip: string;
    ua: string;
    created: string;
};

interface Query extends Q {
    text: string;
    //'created.start'?: string;
    //'created.end'?: string;
}

export function SecurityLogs(): JSX.Element {
    const l = useLocale();
    const [api] = useAdmin();

    const q: Query = {
        page: 1,
        text: '',
        size: 20,
    };

    return <Page title="_p.current.securitylog">
        <RemoteTable<SecurityLog, Query> rest={api} path='/securitylog' paging inSearch systemToolbar queries={q} columns={[
            { id: 'content', label: l.t('_p.current.content') },
            { id: 'ip', label: l.t('_p.current.ip') },
            { id: 'ua', label: l.t('_p.current.ua'), content:(_: string, val?: string)=>{
                if (!val) { return ''; }
                const info = Bowser.parse(val);
                return l.t('_p.current.uaInfo', {
                    browser: info.browser.name,
                    browserVersion: info.browser.version,
                    os: info.os.name,
                    osVersion: info.os.version,
                    kernel: info.engine.name,
                    kernelVersion: info.engine.version,
                });
            } },
            { id: 'created', label: l.t('_p.created'), content:(_: string, val?: string)=>{
                return l.datetimeFormat().format(new Date(val!));
            } },
        ]} queryForm={(qa)=>(
            <>
                <TextField accessor={qa.accessor<string>('text')} />
            </>
        )} />
    </Page>;
}
