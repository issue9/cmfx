// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { Locale } from '@/locales';
import { build, Locales } from './options';
import { Routes } from './route';

test('build', async () => {
    const api = {
        base: 'http://localhost',
        login: '/login',
        settings: '/settings',
        info: '/info',
    };

    const locales: Locales = {
        loader: async (_: Locale): Promise<Record<string, unknown>> => { return {}; },
        locales: ['en', 'cmn-Hans'],
        fallback: 'en'
    };

    const routes:Routes = {
        public: {
            home: '/login',
            routes: [
                {
                    path: '/login',
                    component: ()=>('c')
                }
            ]
        },
        private: {
            home: '/dashboard',
            routes: [
                {
                    path: '/dashboard',
                    component: ()=>('d')
                }
            ]
        }
    };

    expect(()=>build({
        locales,
        routes,
        api: api,
        menus: [],
        title: '',
        logo: 'logo'
    })).toThrowError('title 不能为空');

    expect(()=>build({
        locales,
        routes,
        api: api,
        menus: [],
        title: 'title',
        logo: ''
    })).toThrowError('logo 不能为空');

    const o = build({
        locales,
        routes,
        api: api,
        menus: [],
        title: 't1',
        logo: 'l1'
    });
    expect(o.logo).toEqual('l1');
    expect(o.title).toEqual('t1');
    expect(o.titleSeparator).toEqual(' | ');
    expect(o.systemNotify).toBeTruthy();
});
