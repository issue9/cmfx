// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createApp, Options, Routes } from '@cmfx/admin';
import { Card, Label } from '@cmfx/admin/components';
import * as pages from '@cmfx/admin/pages';
import '@cmfx/admin/style.css';

import { Demo } from './demo';
import { default as Test } from './pages/test';
import './style.css';

//const urlBase = 'http://192.168.10.10:8080/admin';
const urlBase = 'http://localhost:8080/admin';

const demo = new Demo('/demo');
const roles = pages.roles.build('/roles');
const admins = pages.admins.build('/admins');
const system = pages.system.build('/system');
const members = pages.members.build('/members');
const current = pages.current.build('/current', () => {
    return <>
        <pages.current.MemberStatisticPanel />
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

const menus: Options['menus'] = [
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

const o: Options = {
    routes,

    system: {
        dialog: true,
        notification: true
    },

    locales: {
        messages: {
            'en': [
                async () => { return (await import('@cmfx/admin/messages/en.lang')).default; },
                async () => { return (await import('./locales/en')).default; },
            ],
            'zh-Hans': [
                async () => { return (await import('@cmfx/admin/messages/zh-Hans.lang')).default; },
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
        encoding: {
            content: 'application/cbor',
            accept: 'application/json'
        }
    },

    title: 'Title',
    logo: 'icon.svg',
    menus: menus,
    userMenus: current.menus()
};

createApp('app', o);
