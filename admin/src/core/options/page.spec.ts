// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';
import { checkMenus, checkPage } from './page';

test('checkPage', () => {
    expect(() => {
        checkPage({
            login: 'login',
            home: '',
            menus: []
        })
    }).toThrowError('page.home 不能为空');

    expect(() => {
        checkPage({
            login: 'login',
            home: 'login',
            menus: []
        })
    }).toThrowError('login 与 home 不能相同');
});

test('checkMenus', () => {
    expect(() => {
        checkMenus([], [
            { title: '' },
        ]);
    }).toThrowError('title 不能为空');

    expect(() => {
        checkMenus([], [
            { title: 't1', key: 't1' },
            { title: 't1', key: 't1' },
        ]);
    }).toThrowError('存在同名的 key: t1');

    expect(() => { // 子项与父项存在相同的 key
        checkMenus([], [
            { title: 't1', key: 't1' },
            {
                title: 't2', key: 't2', items: [
                    { title: 't1', key: 't1' },
                ]
            },
        ]);
    }).toThrowError('存在同名的 key: t1');
});
