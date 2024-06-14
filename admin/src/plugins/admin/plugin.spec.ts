// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';
import { createI18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';
import { createAdmin, createPlugin } from './plugin';

const api = {
    base: 'http://localhost',
    login: '/login',
    settings: '/settings',
    info: '/info',
};
const page = {
    login: '/login',
    home: '/home',
    menus: []
};

describe('createAdmin', () => {
    const o = {
        api: api,
        page: page,
        title: 'title',
        logo: 'logo'
    };
    const vuetify = createVuetify();
    const i18n = createI18n<false>({
        legacy: false,
        locale: 'zh',
        messages: {
            'zh': {}
        }
    });

    test('createAdmin', () => {
        expect(async () => {
            return (await createAdmin(o, vuetify, i18n)).install;
        }).not.toBeFalsy();
    });
});

test('createPlugin', async () => {
    const o = {
        api: api,
        page: page,
        title: 'title',
        logo: 'logo'
    };
    const vuetify = createVuetify();
    const i18n = createI18n<false>({
        legacy: false,
        locale: 'zh',
        messages: {
            'zh': {}
        }
    });

    const p = await createPlugin(o, vuetify, i18n);
    expect(p.siteTitle).toEqual(o.title);
});
