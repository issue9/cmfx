// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { checkAPI } from './api';

test('checkAPI', () => {
    const api = {
        base: 'http://localhost/',
        login: '/login',
        settings: '/settings',
        info: '/info'
    };

    expect(() => {
        checkAPI(Object.assign({}, api, { login: '' }));
    }).toThrowError('api.login 不能为空');

    expect(() => {
        checkAPI(Object.assign({}, api, { info: '' }));
    }).toThrowError('api.info 不能为空');

    expect(() => {
        checkAPI(Object.assign({}, api, { base: 'localhost' }));
    }).toThrowError('base 格式错误');

    let o = Object.assign({}, api);
    checkAPI(o);
    expect(o.base).toEqual('http://localhost'); // 去掉了尾部的 /

    o = Object.assign({}, api, { info: 'info' });
    checkAPI(o);
    expect(o.info).toEqual('/info');
});
