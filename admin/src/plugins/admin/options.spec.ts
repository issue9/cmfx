// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import localforage from 'localforage';
import { expect, test } from 'vitest';

import { buildOptions } from './options';

test('buildOptions', async () => {
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
    }

    await localforage.clear();

    let o = await buildOptions({
        languages: ['zh'],
        language: '',
        api: api,
        page: page,
        title: 'title',
        logo: 'logo'
    });
    expect(o.titleSeparator).toEqual(' | ');

    await localforage.clear();
    expect(buildOptions({
        languages: ['zh'],
        language: 'zh',
        api: api,
        page: page,
        title: '',
        logo: 'logo'
    })).rejects.toThrowError('title 不能为空');

    await localforage.clear();
    expect(buildOptions({
        languages: ['zh'],
        language: 'zh',
        api: api,
        page: page,
        title: 'title',
        logo: ''
    })).rejects.toThrowError('logo 不能为空');

    await localforage.clear();
    await buildOptions({
        languages: ['zh'],
        language: 'zh',
        api: api,
        page: page,
        title: 'title',
        logo: 'logo'
    });
    o = await buildOptions({
        languages: ['zh'],
        language: 'zh',
        api: api,
        page: page,
        title: 't1',
        logo: 'l1'
    });
    expect(o.logo).toEqual('logo');
    expect(o.title).toEqual('title');
});
