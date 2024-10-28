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
const current = pages.current.build('/current', <>
    <div class="flex gap-4">
        <pages.current.Panel class="basis-1/2">1/2</pages.current.Panel>
        <pages.current.Panel class="basis-1/2">1/2</pages.current.Panel>
    </div>
    <div class="flex gap-4">
        <pages.current.Panel class="basis-1/3" icon="dashboard" title="daahboard">1/3</pages.current.Panel>
        <div class="basis-2/3 flex flex-col gap-4">
            <pages.current.Panel icon="dashboard" title="daahboard">line 1</pages.current.Panel>
            <pages.current.Panel>line 2</pages.current.Panel>
        </div>
    </div>
</>);

const routes: Routes = {
    public: {
        home: '/login',
        routes: [
            { path: '/login', component: ()=><pages.current.Login footer={[
                {title: '&copy; 2024 by Example .Inc', link: 'https://example.com'},
                {title: 'aaaabbbcccdddeeefff'},
                {title: 'repo', link: 'https://github.com/issue/cmfx'},
            ]} /> },
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

    title: 'Title',
    logo: 'icon.svg',
    menus: menus,
    userMenus: current.menus()
};

createApp('app', o);
