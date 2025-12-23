// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { build } from './options';
import { Routes } from './route';

const api = {
    base: 'http://localhost',
    token: '/login',
    info: '/info',
    pageSizes: [1, 2],
    pageSize: 1
};

const locales = {
    messages: {
        'en': [async () => { return (await import('@/messages/en.lang')).default; }],
        'zh-Hans': [async () => { return (await import('@/messages/zh-Hans.lang')).default; }],
    },
    fallback: 'en'
};

const routes: Routes = {
    public: {
        home: '/login',
        routes: [
            {
                path: '/login',
                component: () => ('c')
            }
        ]
    },
    private: {
        home: '/dashboard',
        routes: [
            {
                path: '/dashboard',
                component: () => ('d')
            }
        ]
    }
};

export const options = build({
    id: 'abc',
    ...locales,
    routes,
    api: api,
    menus: [],
    userMenus: [],
    title: 't1',
    logo: 'l1'
});

test('build', async () => {
    const o = build({
        id: 'abc',
        ...locales,
        routes,
        api: api,
        userMenus: [],
        title: 't1',
        logo: 'l1',
        menus: [],
    });
    expect(o.logo).toEqual('l1');
    expect(o.title).toEqual('t1');
    expect(o.api.contentType).toEqual('application/json');
    expect(o.api.acceptType).toEqual('application/json');
    expect(o.titleSeparator).toEqual(' | ');
    expect(o.floatingMinWidth).toEqual('lg'); // 默认值
});
