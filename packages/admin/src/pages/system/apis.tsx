// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Column, Label, Page, RemoteTable } from '@cmfx/components';
import { Duration, formatDuration, Method, parseDuration, Query } from '@cmfx/core';
import { JSX } from 'solid-js';
import IconAPI from '~icons/material-symbols/api';

import { useLocale } from '@/context';

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
    const l = useLocale();

    const queries: Q = {
        method: ['GET', 'DELETE', 'PUT', 'PATCH', 'POST'],
        text: ''
    };

    return <Page title="_p.system.apiViewer">
        <RemoteTable systemToolbar queries={queries} path='/system/apis' hoverable
            toolbar={<Label icon={<IconAPI />}>{ l.t('_p.system.apis') }</Label>}
            columns={[
                { id: 'router', label: l.t('_p.system.router') },
                { id: 'method', label: l.t('_p.system.method') },
                { id: 'pattern', label: l.t('_p.system.pattern') },

                { id: 'count', label: l.t('_p.system.count') },
                {
                    id: 'last', label: l.t('_p.system.last'),
                    content: (_: string, val: string) => { return l.datetimeFormat().format(new Date(val)); }
                },
                { id: 'serverErrors', label: l.t('_p.system.serverErrors') },
                { id: 'userErrors', label: l.t('_p.system.userErrors') },

                { id: 'max', label: l.t('_p.system.max'), content: (_: string, val: Duration) => { formatDuration(l.durationFormat(), val); } },
                { id: 'min', label: l.t('_p.system.min'), content: (_: string, val: Duration) => { return formatDuration(l.durationFormat(), val); } },
                { id: 'spend', label: l.t('_p.system.spend'), content: (_: string, val: Duration, api?: API) => {
                    const count = api?.count!;
                    val = count > 0 ? parseDuration(val) / count : 0;
                    return formatDuration(l.durationFormat(), val);
                } },
            ] as Array<Column<API>>} />
    </Page>;
}
