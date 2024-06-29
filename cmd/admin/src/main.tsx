// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Contrast, Mode, Options, Routes, createApp } from 'admin/dev';
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
                path: '/dashboard',
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
        base: 'http://192.168.10.3:8080/admin',
        login: '/login',
        settings: '/settings',
        info: '/info',
    },

    theme: {
        mode: Mode.System,
        contrast: Contrast.NoPreference,
        primary: '#ccc'
    },
    title: 'title',
    logo: 'http://localhost/favicon.ico',
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

/*
import { Contrast, Mode, Options, create } from '@/index';
import { XLogin } from '@/pages';
import { createI18n } from 'vue-i18n';
import { createRouter, createWebHashHistory } from 'vue-router';

// Vuetify
import { createVuetify } from 'vuetify';
import { md3 } from 'vuetify/blueprints';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';

const i18n = createI18n<false>({
    fallbackLocale: 'en',
    legacy: false,
    locale: 'cmn-Hans',
    messages: {
        'cmn-Hans': {
            'home': '首页'
        }
    }
});

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/login',
            component: XLogin,
            meta: { public: true }
        },
        {
            path: '/home',
            component: () => import('./XHome.vue')
        },
        {
            path: '/',
            redirect: '/home'
        }
    ]
});

const app = await create(o, router, vuetify, i18n);
app.mount('#app');
*/
