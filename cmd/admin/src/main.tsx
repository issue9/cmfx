// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createApp, Options, Routes } from 'admin/dev';

import * as pages from 'admin/dev/pages';
import 'admin/dev/style.css';

import { Demo } from './demo';
import { default as Test } from './pages/test';

const urlBase = 'http://192.168.10.10:8080/admin';
//const urlBase = 'http://localhost:8080/admin';

const demo = new Demo('/demo');
const roles = pages.roles.build('/roles');
const admins = pages.admins.build('/admins');
const system = pages.system.build('/system');
const current = pages.current.build('/current');

const routes: Routes = {
    public: {
        home: '/login',
        routes: [
            { path: '/login', component: pages.current.Login },
        ]
    },
    private: {
        home: '/current/dashboard',
        routes: [
            { path: ['/dashboard', '/'], component: pages.current.Dashboard },
            { path: '/test', component: Test },
            ...roles.routes(),
            ...admins.routes(),
            ...system.routes(),
            ...demo.routes(),
            ...current.routes(),
        ]
    }
};

const menus: Options['menus'] = [
    { type: 'item', icon: 'dashboard', label: '_i.page.current.dashboard', path: '/current/dashboard' },
    { type: 'item', label: 'nest.abc', path: '/test' },
    {
        type: 'group', label: 'system', items: [
            {
                type: 'item', label: 'administrator', icon: 'admin_panel_settings', items: [
                    ...roles.menus(),
                    ...admins.menus(),
                ]
            },
            {
                type: 'item', label: '_i.page.system.system', icon: 'host', items: [
                    ...system.menus(),
                ]
            }
        ]
    },
    ...demo.menus()
];

const o: Options = {
    routes,

    system: {
        dialog: true,
        notification: true
    },

    locales: {
        messages: {
            'en': [
                async () => { return (await import('admin/dev/messages/en.ts')).default; },
                async () => { return (await import('./locales/en')).default; },
            ],
            'cmn-Hans': [
                async () => { return (await import('admin/dev/messages/cmn-Hans.ts')).default; },
                async () => { return (await import('./locales/cmn-Hans')).default; },
            ],
        },
        fallback: 'en',
        locales: ['en', 'cmn-Hans']
    },

    api: {
        base: urlBase,
        login: '/login',
        info: '/info',
        pageSizes: [10, 20, 50, 100],
        defaultSize: 20
    },

    title: 'title',
    logo: 'icon.svg',
    menus: menus,
    userMenus: current.menus()
};

createApp('app', o);
