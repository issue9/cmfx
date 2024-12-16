// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createApp } from '@cmfx/admin/dev';
import { AppOptions, Routes, Card, Label } from '@cmfx/admin/dev/components';

import * as pages from '@cmfx/admin/dev/pages';
import '@cmfx/admin/dev/style.css';

import { Demo } from './demo';
import { default as Test } from './pages/test';

const urlBase = 'http://192.168.10.10:8080/admin';
//const urlBase = 'http://localhost:8080/admin';

const demo = new Demo('/demo');
const roles = pages.roles.build('/roles');
const admins = pages.admins.build('/admins');
const system = pages.system.build('/system');
const members = pages.members.build('/members');
const current = pages.current.build('/current', () => {
    return <>
        <div class="flex gap-4">
            <Card class="basis-1/2">1/2</Card>
            <Card class="basis-1/2">1/2</Card>
        </div>
        <div class="flex gap-4">
            <Card class="basis-1/3" header={<Label icon="dashboard">dashboard</Label>}>1/3</Card>
            <div class="basis-2/3 flex flex-col gap-4">
                <Card header={<Label icon="dashboard">dashboard</Label>}>line 1</Card>
                <Card>line 2</Card>
            </div>
        </div>
    </>;
});

const routes: Routes = {
    public: {
        home: '/login',
        routes: [
            { path: '/login', component: ()=><pages.current.Login footer={[
                {title: '&copy; 2024 by Example .Inc', link: 'https://example.com'},
                {title: 'text'},
                {title: 'repo', link: 'https://github.com/issue/cmfx'},
            ]} /> },
        ]
    },
    private: {
        home: '/current/dashboard',
        routes: [
            { path: ['/dashboard', '/'], component: pages.current.Dashboard },
            { path: '/test/:id/test', component: Test },
            ...roles.routes(),
            ...admins.routes(),
            ...system.routes(),
            ...demo.routes(),
            ...current.routes(),
            ...members.routes(),
        ]
    }
};

const menus: AppOptions['menus'] = [
    { type: 'item', icon: 'dashboard', label: '_i.page.current.dashboard', path: '/current/dashboard' },
    { type: 'item', label: 'nest.abc', path: '/test/5/test' },
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
            },
            {
                type: 'item', label: '_i.page.member.member', icon: 'supervisor_account', items: [
                    ...members.menus(),
                ]
            }
        ]
    },
    ...demo.menus()
];

const o: AppOptions = {
    routes,

    system: {
        dialog: true,
        notification: true
    },

    locales: {
        messages: {
            'en': [
                async () => { return (await import('@cmfx/admin/dev/messages/en.ts')).default; },
                async () => { return (await import('./locales/en')).default; },
            ],
            'zh-Hans': [
                async () => { return (await import('@cmfx/admin/dev/messages/zh-Hans.ts')).default; },
                async () => { return (await import('./locales/zh-Hans')).default; },
            ],
        },
        fallback: 'en',
        locales: ['en', 'zh-Hans']
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
