// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import localforage from 'localforage';
import { expect, test } from 'vitest';

import { Locale } from '@/locales';
import { Locales } from './locales';
import { build } from './options';
import { Routes } from './route';
import { Contrast, Mode } from './theme';

test('build', async () => {
    const api = {
        base: 'http://localhost',
        login: '/login',
        settings: '/settings',
        info: '/info',
    };

    const theme = {
        mode: Mode.System,
        contrast: Contrast.NoPreference,
        primary: '#ccc'
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

    await localforage.clear();

    let o = await build({
        locales,
        routes,
        api: api,
        menus: [],
        theme: theme,
        title: 'title',
        logo: 'logo'
    });
    expect(o.titleSeparator).toEqual(' | ');

    await localforage.clear();
    expect(build({
        locales,
        routes,
        api: api,
        menus: [],
        theme: theme,
        title: '',
        logo: 'logo'
    })).rejects.toThrowError('title 不能为空');

    await localforage.clear();
    expect(build({
        locales,
        routes,
        api: api,
        menus: [],
        theme: theme,
        title: 'title',
        logo: ''
    })).rejects.toThrowError('logo 不能为空');


    // 由 build 保存至 localforeage
    await localforage.clear();
    await build({
        locales,
        routes,
        api: api,
        menus: [],
        theme: theme,
        title: 'title',
        logo: 'logo'
    });
    o = await build({
        locales,
        routes,
        api: api,
        menus: [],
        theme: theme,
        title: 't1',
        logo: 'l1'
    });
    expect(o.logo).toEqual('logo');
    expect(o.title).toEqual('title');

    // 由 Options.logo 保存至 localforeage
    await localforage.clear();
    await localforage.clear();
    await build({
        locales,
        routes,
        api: api,
        menus: [],
        theme: theme,
        title: 'title',
        logo: 'logo'
    });
    o.logo = 'logo2';
    o = await build({
        locales,
        routes,
        api: api,
        menus: [],
        theme: theme,
        title: 't1',
        logo: 'l1'
    });
    expect(o.logo).toEqual('logo2');
    expect(o.title).toEqual('title');
});
