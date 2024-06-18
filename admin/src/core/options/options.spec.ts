// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import localforage from 'localforage';
import { expect, test } from 'vitest';

import { build } from './options';
import { Contrast, Mode } from './theme';

test('build', async () => {
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
    const theme = {
        mode: Mode.System,
        contrast: Contrast.Standard,
        primary: '#ccc'
    };

    await localforage.clear();

    let o = await build({
        api: api,
        page: page,
        theme: theme,
        title: 'title',
        logo: 'logo'
    });
    expect(o.titleSeparator).toEqual(' | ');

    await localforage.clear();
    expect(build({
        api: api,
        page: page,
        theme: theme,
        title: '',
        logo: 'logo'
    })).rejects.toThrowError('title 不能为空');

    await localforage.clear();
    expect(build({
        api: api,
        page: page,
        theme: theme,
        title: 'title',
        logo: ''
    })).rejects.toThrowError('logo 不能为空');


    // 由 build 保存至 localforeage
    await localforage.clear();
    await build({
        api: api,
        page: page,
        theme: theme,
        title: 'title',
        logo: 'logo'
    });
    o = await build({
        api: api,
        page: page,
        theme: theme,
        title: 't1',
        logo: 'l1'
    });
    expect(o.logo).toEqual('logo');
    expect(o.title).toEqual('title');

    // 由 Options.logo 保存至 localforeage
    await localforage.clear();
    await localforage.clear();
    await build({
        api: api,
        page: page,
        theme: theme,
        title: 'title',
        logo: 'logo'
    });
    o.logo = 'logo2';
    o = await build({
        api: api,
        page: page,
        theme: theme,
        title: 't1',
        logo: 'l1'
    });
    expect(o.logo).toEqual('logo2');
    expect(o.title).toEqual('title');
});
