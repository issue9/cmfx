// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { create, Options } from '@/index';
import { createI18n } from 'vue-i18n';
import { createRouter, createWebHashHistory } from 'vue-router';

// Vuetify
import { createVuetify } from 'vuetify';
import { md3 } from 'vuetify/blueprints';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';

const i18n = createI18n({
    legacy: false,
    locale: 'zhHans',
    messages: {
        'zhHans': {
            'home': '首页'
        }
    }
});

const vuetify = createVuetify({
    components,
    directives,
    blueprint: md3
});

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        // TODO
    ]
});

const o: Options = {
    api: {
        base: 'http://localhost',
        login: '/login',
        settings: '/settings',
        info: '/info',
    },
    title: 'title',
    logo: 'http://localhost/favicon.ico',
    page: {
        login: '/login',
        home: '/home',
        menus: [
            {
                title: i18n.global.t('home'),
                key: '/home'
            }
        ]
    }

};

const app = await create(o, router, vuetify, i18n);
app.mount('#app');
