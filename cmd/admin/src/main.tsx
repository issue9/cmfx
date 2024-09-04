// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createApp, Options, Routes } from 'admin/dev';

import * as pages from 'admin/dev/pages';
import 'admin/dev/style.css';

import { Demo } from './demo';
import { loads } from './locales';
import { default as Test } from './pages/test';

const urlBase = 'http://192.168.10.10:8080/admin';
//const urlBase = 'http://localhost:8080/admin';

const demo = new Demo('/demo');
const roles = pages.roles.build('/roles');
const admins = pages.admins.build('/admins');

const routes: Routes = {
    public: {
        home: '/login',
        routes: [
            { path: '/login', component: pages.Login }
        ]
    },
    private: {
        home: '/dashboard',
        routes: [
            ...roles.routes(),
            ...admins.routes(),
            { path: ['/dashboard', '/'], component: pages.Dashboard },
            ...demo.routes(),
            { path: '/test', component: Test }
        ]
    }
};

console.log(routes);

const menus: Options['menus'] = [
    { type: 'item', label: 'home', path: '/dashboard' },
    { type: 'item', label: 'nest.abc', path: '/test' },
    {
        type: 'group', label: 'system', items: [
            {
                type: 'item', label: 'administrator', items: [
                    ...roles.menus(),
                    ...admins.menus(),
                ]
            },
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
        messages: loads,
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
    menus: menus
};

createApp('app', o);
