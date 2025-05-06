// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import './style.css';

import { admins, createApp, current, members, MenuItem, Options, roles, Routes, system } from '@cmfx/admin';
import { Card, Label } from '@cmfx/components';

import { default as Test } from './pages/test';

const urlBase = 'http://localhost:8080/admin';

const rolesPage = roles.build('/roles');
const adminsPage = admins.build('/admins');
const systemPage = system.build('/system');
const membersPage = members.build('/members');
const currentPage = current.build('/current', () => {
    return <>
        <current.MemberStatisticPanel />
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
            { path: '/login', component: ()=><current.Login footer={[
                {title: '&copy; 2024 by Example .Inc', link: 'https://example.com'},
                {title: 'text'},
                {title: 'repo', link: 'https://github.com/issue/cmfx'},
            ]} /> },
        ]
    },
    private: {
        home: '/current/dashboard',
        routes: [
            { path: ['/dashboard', '/'], component: current.Dashboard },
            { path: '/test/:id/test', component: Test },
            ...rolesPage.routes(),
            ...adminsPage.routes(),
            ...systemPage.routes(),
            ...currentPage.routes(),
            ...membersPage.routes(),
        ]
    }
};

const menus: Array<MenuItem> = [
    { type: 'item', icon: 'dashboard', label: '_i.page.current.dashboard', path: '/current/dashboard' },
    { type: 'item', label: 'nest.abc', path: '/test/5/test' },
    {
        type: 'group', label: 'system', items: [
            {
                type: 'item', label: 'administrator', icon: 'admin_panel_settings', items: [
                    ...rolesPage.menus(),
                    ...adminsPage.menus(),
                ]
            },
            {
                type: 'item', label: '_i.page.system.system', icon: 'host', items: [
                    ...systemPage.menus(),
                ]
            },
            {
                type: 'item', label: '_i.page.member.member', icon: 'supervisor_account', items: [
                    ...membersPage.menus(),
                ]
            }
        ]
    },
];

const o: Options = {
    id: 'admin-demo',
    storage: window.localStorage,

    routes,

    system: {
        dialog: true,
        notification: true
    },

    locales: {
        messages: {
            'en': [
                async () => { return (await import('@cmfx/components/messages/en.lang.js')).default; },
                async () => { return (await import('@cmfx/admin/messages/en.lang.js')).default; },
                async () => { return (await import('./locales/en')).default; },
            ],
            'zh-Hans': [
                async () => { return (await import('@cmfx/components/messages/zh-Hans.lang.js')).default; },
                async () => { return (await import('@cmfx/admin/messages/zh-Hans.lang.js')).default; },
                async () => { return (await import('./locales/zh-Hans')).default; },
            ],
        },
        fallback: 'en',
    },

    api: {
        base: urlBase,
        token: '/token',
        info: '/info',
        contentType: 'application/cbor',
        acceptType: 'application/json'
    },

    title: 'Title',
    logo: 'icon.svg',
    aside: {
        menus: menus,
    },
    userMenus: currentPage.menus()
};

createApp('app', o);
