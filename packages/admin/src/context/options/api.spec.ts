// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { API, sanitizeAPI } from './api';

test('sanitizeAPI', () => {
    const api: API = {
        base: 'http://localhost/',
        token: '/login',
        info: '/info',
        pageSizes: [1,2],
        presetSize: 1
    };

    expect(() => {
        sanitizeAPI(Object.assign({}, api, { token: '' }));
    }).toThrowError('api.token 不能为空');

    expect(() => {
        sanitizeAPI(Object.assign({}, api, { info: '' }));
    }).toThrowError('api.info 不能为空');

    expect(() => {
        sanitizeAPI(Object.assign({}, api, { base: 'localhost' }));
    }).toThrowError('base 格式错误');

    let o = Object.assign({}, api);
    o = sanitizeAPI(o);
    expect(o.base).toEqual('http://localhost'); // 去掉了尾部的 /
    expect(o.contentType).toEqual('application/json');
    expect(o.acceptType).toEqual('application/json');

    o = Object.assign({}, api, { info: 'info' });
    o = sanitizeAPI(o);
    expect(o.info).toEqual('/info');
});
