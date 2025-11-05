// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { beforeEach, describe, expect, test } from 'vitest';

import { sleep } from '@/time';
import { API, query2Search } from './api';
import { Token, writeToken } from './token';

describe('API', () => {
    const id = 'cmfx-token-name';
    const s = window.localStorage;

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test('build', async () => {
        const api = await API.build(id, s, 'http://localhost', '/login', 'application/json', 'application/yaml', 'zh-cn');
        expect(api).not.toBeNull();
    });

    test('buildURL', async () => {
        const f = await API.build(id, s, 'http://localhost', '/login', 'application/json', 'application/yaml', 'zh-cn');
        expect(f.buildURL('/path')).toEqual('http://localhost/path');
        expect(f.buildURL('path')).toEqual('http://localhost/path');
        expect(() => { f.buildURL(''); }).toThrowError('参数 path 不能为空');
    });

    test('get', async () => {
        fetchMock.mockResponseOnce('123');

        const api = await API.build(id, s, 'http://localhost', '/login', 'application/yaml', 'application/json', 'zh-cn');
        const data = await api.get('/abc');
        expect(data.ok).toBeTruthy();
        expect(data.status).toEqual(200);
        expect(data.body).toEqual<number>(123);
    });

    test('post', async () => {
        fetchMock.mockResponseOnce('123', { status: 401 });

        const f = await API.build(id, s, 'http://localhost', '/login', 'application/yaml', 'application/json', 'zh-cn');
        const data = await f.post('/abc');
        expect(data.ok).toBeFalsy();
    });
});

describe('API token', () => {
    const id = 'cmfx-token-name';
    const s = window.sessionStorage;

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    const token: Token = {
        refresh_token: 'refresh',
        access_token: 'access',
        refresh_exp: 2,
        access_exp: 1,
    };

    test('undefined token', async () => {
        let f = await API.build(id, s, 'http://localhost', '/login', 'application/json', 'application/yaml', 'zh-cn');
        let t = await f.getToken();
        expect(t).toBeUndefined();
    });

    test('token', async () => {
        writeToken(Object.assign({}, token), id, s);
        const api = await API.build(id, s, 'http://localhost', '/login', 'application/json', 'application/yaml', 'zh-cn');
        let t = await api.getToken(); // 过期时间在 1 秒之内，必然未过期。
        expect(t).toEqual('access');

        fetchMock.mockResponseOnce(JSON.stringify(Object.assign({}, token)));
        await api.getToken();
        await sleep(1000);// 过期，但未过刷新令牌时间。会刷新令牌。
        t = await api.getToken();
        expect(t).toEqual('access');

        await sleep(3000);// 刷新令牌也过期
        t = await api.getToken();
        expect(t).toBeUndefined();
    });

    test('login', async () => {
        const api = await API.build(id, s, 'http://localhost', '/login', 'application/yaml', 'application/json', 'zh-cn');
        fetchMock.mockResponseOnce(JSON.stringify(Object.assign({}, token)));
        const ret = await api.login({
            status: 201,
            ok: true,
            body: { access_token: 'access', refresh_token: 'refresh', access_exp: 12345, refresh_exp: 12345 },
        });
        expect(ret).toBeTruthy();

        let t = await api.getToken();
        expect(t).toEqual('access');

        fetchMock.mockResponseOnce('123');
        await api.logout();
        t = await api.getToken();
        expect(t).toBeUndefined();
    });
});

test('query2Search', () => {
    expect(query2Search({ str: 'str' })).toEqual('?str=str');
    expect(query2Search({ str: 'str', page: 1 })).toEqual('?str=str&page=0');
    expect(query2Search({ str: 'str', num: 0, bool: false })).toEqual('?str=str&num=0&bool=false');
    expect(query2Search({ str: ['str'], num: [0, 1], bool: false })).toEqual('?str=str&num=0%2C1&bool=false');
    expect(query2Search({})).toEqual('');
});
