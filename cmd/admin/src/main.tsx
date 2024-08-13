// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Options, Routes, createApp } from 'admin/dev';

import * as pages from 'admin/dev/pages';
import 'admin/dev/style.css';

import * as demo from './demo';
import { Message } from './locales';
import { default as Test } from './pages/test';

const urlBase = 'http://192.168.10.10:8080/admin';
//const urlBase = 'http://localhost:8080/admin';

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
            { path: ['/dashboard', '/'], component: pages.Dashboard },
            { path: '/roles', component: pages.Dashboard },
            { path: '/admins', component: pages.Dashboard },
            { path: '/demo', children: demo.routes },
            { path: '/test', component: Test }
        ]
    }
};

const menus: Options['menus'] = [
    { type: 'item', label: 'home', path: '/dashboard' },
    { type: 'item', label: 'nest.abc', path: '/test' },
    {
        type: 'group', label: 'system', items: [
            {
                type: 'item', label: 'administrator', items: [
                    { type: 'item', label: 'role', path: '/roles' },
                    { type: 'item', label: 'administrator', path: '/admins' },
                ]
            },
        ]
    },
    demo.menus
];

const o: Options = {
    routes,

    locales: {
        loader: async (id): Promise<Message> => {
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

    title: 'title',
    logo: 'icon.svg',
    menus: menus
};

createApp('app', o);
