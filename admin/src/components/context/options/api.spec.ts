// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { API, sanitizeAPI } from './api';

test('sanitizeAPI', () => {
    const api: API = {
        base: 'http://localhost/',
        login: '/login',
        info: '/info',
        pageSizes: [1,2],
        presetSize: 1
    };

    expect(() => {
        sanitizeAPI(Object.assign({}, api, { login: '' }));
    }).toThrowError('api.login 不能为空');

    expect(() => {
        sanitizeAPI(Object.assign({}, api, { info: '' }));
    }).toThrowError('api.info 不能为空');

    expect(() => {
        sanitizeAPI(Object.assign({}, api, { base: 'localhost' }));
    }).toThrowError('base 格式错误');

    let o = Object.assign({}, api);
    sanitizeAPI(o);
    expect(o.base).toEqual('http://localhost'); // 去掉了尾部的 /
    expect(o.encoding).toEqual({ content: 'application/json', accept: 'application/json' });

    o = Object.assign({}, api, { info: 'info' });
    sanitizeAPI(o);
    expect(o.info).toEqual('/info');
});
