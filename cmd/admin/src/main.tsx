// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Options, Routes, createApp } from 'admin/dev';
import { default as demoRoutes } from 'admin/dev/demo';

import * as pages from 'admin/dev/pages';
import 'admin/dev/style.css';

const urlBase = 'http://192.168.10.7:8080/admin';
//const urlBase = 'http://localhost:8080/admin';

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
            },
            {
                path: '/roles',
                component: pages.Dashboard
            },
            {
                path: '/admins',
                component: pages.Dashboard
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
        base: urlBase,
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
            type: 'item',
            label: 'home',
            path: '/dashboard'
        },
        {
            type: 'group',
            label: 'system',
            items: [
                {
                    type: 'item',
                    label: 'administrator',
                    items: [
                        {
                            type: 'item',
                            label: 'role',
                            path: '/roles'
                        },
                        {
                            type: 'item',
                            label: 'administrator',
                            path: '/admins'
                        },
                    ]
                },
            ]
        },
    ]
};

createApp('app', o);
