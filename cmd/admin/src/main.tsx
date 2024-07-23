// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Options, Routes, createApp } from 'admin/dev';
import { default as demoRoutes } from 'admin/dev/demo';

import * as pages from 'admin/dev/pages';
import 'admin/dev/style.css';

const routes: Routes = {
    public: {
        home: '/login',
        routes: [
            {
                path: '/login',
                component: pages.Login,
            },
            demoRoutes('/demo')
        ]
    },
    private: {
        home: '/dashboard',
        routes: [
            {
                path: ['/dashboard', '/'],
                component: pages.Dashboard,
            }
        ]
    }
};

const o: Options = {
    routes,

    locales: {
        loader: async (id): Promise<Record<string, unknown>> => {
            return (await import(`./locales/${id}.ts`)).default;
        },
        fallback: 'en',
        locales: ['en', 'cmn-Hans']
    },

    api: {
        base: 'http://192.168.10.7:8080/admin',
        login: '/login',
        settings: '/settings',
        info: '/info',
    },

    theme: {
        mode: 'system',
        contrast: 'nopreference',
        scheme: 20
    },
    title: 'title',
    logo: 'icon.svg',
    menus: [
        {
            title: 'test',
            key: '/buttons'
        },
        {
            title: '_internal.ok',
            key: '/dashboard'
        },
        {
            title: '_internal.login.title',
            key: '/login'
        },
    ]
};

createApp('app', o);
