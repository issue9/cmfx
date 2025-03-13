// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { AppOptions } from '@/components';
import { options } from '@/components/context/options/options.spec';
import { API, Config, Locale } from '@/core';
import { buildItemsWithSearch } from './search';


describe('search', async () => {
    const api = await API.build(localStorage, options.api.base, options.api.login, options.mimetype, 'zh-Hans');
    Locale.init('en', api);
    const l = new Locale(new Config('admin', sessionStorage));
    const menus: AppOptions['menus'] = [
        {'type': 'divider'},
        {'type': 'item', label: 'item-1'},
        {'type': 'item', label: 'item-2', items: [
            {'type': 'item', label: 'item-2-1'},
            {'type': 'item', label: 'item-2-2'},
        ]},
        {'type': 'item', label: 'item-3'},
        {'type': 'group', label: 'group-1', items: [
            {'type': 'item', label: 'group-1-1'},
            {'type': 'item', label: 'group-1-2'},
        ]},
    ];

    test('buildItemsWithSearch', async () => {
        expect(buildItemsWithSearch(l, menus, '')).toHaveLength(0);
        expect(buildItemsWithSearch(l, menus, 'not-exists')).toHaveLength(0);

        expect(buildItemsWithSearch(l, menus, 'item-3')).toHaveLength(1);
        expect(buildItemsWithSearch(l, menus, 'item-2')).toHaveLength(2);
        expect(buildItemsWithSearch(l, menus, 'item-2-2')).toHaveLength(1);
        expect(buildItemsWithSearch(l, menus, 'group-1')).toHaveLength(2);
    });
});
