// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Duration, Method, parseDuration, Query } from '@cmfx/core';
import { JSX } from 'solid-js';

import { Column, Label, Page, RemoteTable, useApp } from '@admin/components';

interface API {
    method: string;
    pattern: string;
    router: string;

    count: number; // 总的请求次数
    last: string; // 时间字符串
    serverErrors: number; // 500 及以上的错误的次数
    userErrors: number; // 400-499 错误的次数

    // 以下是与速度相关的数据，是对一个时间段的表述，
    // 符合 go 中 time.Duration 的序列化要求。比如 2s 表示两秒。

    max: Duration;
    min: Duration;
    spend: Duration;
}

interface Q extends Query {
    method: Array<Method>;
    text: string;
}

export function APIs(): JSX.Element {
    const ctx = useApp();

    const queries: Q = {
        method: ['GET', 'DELETE', 'PUT', 'PATCH', 'POST'],
        text: ''
    };

    return <Page title="_i.page.system.apiViewer">
        <RemoteTable systemToolbar queries={queries} path='/system/apis'
            toolbar={<Label icon='api'>{ ctx.locale().t('_i.page.system.apis') }</Label>}
            columns={[
                { id: 'router', label: ctx.locale().t('_i.page.system.router') },
                { id: 'method', label: ctx.locale().t('_i.page.system.method') },
                { id: 'pattern', label: ctx.locale().t('_i.page.system.pattern') },
    
                { id: 'count', label: ctx.locale().t('_i.page.system.count') },
                { id: 'last', label: ctx.locale().t('_i.page.system.last'), content: (_: string, val: string) => { return ctx.locale().datetime(val); } },
                { id: 'serverErrors', label: ctx.locale().t('_i.page.system.serverErrors') },
                { id: 'userErrors', label: ctx.locale().t('_i.page.system.userErrors') },
    
                { id: 'max', label: ctx.locale().t('_i.page.system.max'), content: (_: string, val: Duration) => { return ctx.locale().duration(val); } },
                { id: 'min', label: ctx.locale().t('_i.page.system.min'), content: (_: string, val: Duration) => { return ctx.locale().duration(val); } },
                { id: 'spend', label: ctx.locale().t('_i.page.system.spend'), content: (_: string, val: Duration, api?: API) => {
                    const count = api?.count!;
                    val = count > 0 ? parseDuration(val) / count : 0;
                    return ctx.locale().duration(val);
                } },
            ] as Array<Column<API>>} />
    </Page>;
}
