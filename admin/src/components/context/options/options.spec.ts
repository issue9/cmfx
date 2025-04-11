// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { buildOptions } from '.';
import { build, Locales } from './options';
import { Routes } from './route';

const api = {
    base: 'http://localhost',
    token: '/login',
    info: '/info',
    pageSizes: [1, 2],
    presetSize: 1
};

const locales: Locales = {
    messages: {
        'en': [async () => { return (await import('@/messages/en.lang')).default; }],
        'zh-Hans': [async () => { return (await import('@/messages/zh-Hans.lang')).default; }],
    },
    locales: ['en', 'zh-Hans'],
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

export const options = buildOptions({
    id: 'abc',
    locales,
    routes,
    api: api,
    userMenus: [],
    title: 't1',
    logo: 'l1'
});

test('build', async () => {
    expect(()=>build({
        id: 'abc',
        locales,
        routes,
        api: api,
        userMenus: [],
        title: '',
        logo: 'logo'
    })).toThrowError('title 不能为空');

    expect(()=>build({
        id: 'abc',
        locales,
        routes,
        api: api,
        userMenus: [],
        title: 'title',
        logo: ''
    })).toThrowError('logo 不能为空');

    const o = build({
        id: 'abc',
        locales,
        routes,
        api: api,
        userMenus: [],
        title: 't1',
        logo: 'l1',
        aside:{
            menus: [],
        }
    });
    expect(o.logo).toEqual('l1');
    expect(o.title).toEqual('t1');
    expect(o.api.contentType).toEqual('application/json');
    expect(o.api.acceptType).toEqual('application/json');
    expect(o.titleSeparator).toEqual(' | ');
    expect(o.aside.floatingMinWidth).toEqual('xs'); // 默认值
});
