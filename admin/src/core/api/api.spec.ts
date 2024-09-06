// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { beforeEach, describe, expect, test } from 'vitest';

import { sleep } from '../time';
import { API, query2Search } from './api';
import { Token, writeToken } from './token';

describe('API', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test('build', async () => {
        const f = await API.build('http://localhost', '/login', 'application/json', 'zh-cn');
        expect(f).not.toBeNull();
    });

    test('buildURL', async () => {
        const f = await API.build('http://localhost', '/login', 'application/json', 'zh-cn');
        expect(f.buildURL('/path')).toEqual('http://localhost/path');
        expect(f.buildURL('path')).toEqual('http://localhost/path');
        expect(() => { f.buildURL(''); }).toThrowError('参数 path 不能为空');
    });

    test('get', async() => {
        fetchMock.mockResponseOnce('123');

        const f = await API.build('http://localhost', '/login', 'application/json', 'zh-cn');
        const data = await f.get('/abc');
        expect(data.ok).toBeTruthy();
        expect(data.status).toEqual(200);
        expect(data.body).toEqual<number>(123);
    });

    test('post', async () => {
        fetchMock.mockResponseOnce('123', {status: 401});

        const f = await API.build('http://localhost', '/login', 'application/json', 'zh-cn');
        const data = await f.post('/abc');
        expect(data.ok).toBeFalsy();
    });
});

describe('API token', () => {
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
        let f = await API.build('http://localhost', '/login', 'application/json', 'zh-cn');
        let t = await f.getToken();
        expect(t).toBeUndefined();
    });

    test('token', async () => {
        await writeToken(Object.assign({}, token));
        const f = await API.build('http://localhost', '/login', 'application/json', 'zh-cn');
        let t = await f.getToken(); // 过期时间在 1 秒之内，必然未过期。
        expect(t).toEqual('access');

        fetchMock.mockResponseOnce(JSON.stringify(Object.assign({}, token)));
        t = await f.getToken();
        await sleep(1000);// 过期，但未过刷新令牌时间。会刷新令牌。
        t = await f.getToken();
        expect(t).toEqual('access');

        await sleep(3000);// 刷新令牌也过期
        t = await f.getToken();
        expect(t).toBeUndefined();
    });

    test('login', async () => {
        const f = await API.build('http://localhost', '/login', 'application/json', 'zh-cn');
        fetchMock.mockResponseOnce(JSON.stringify(Object.assign({}, token)));
        const ret = await f.login({ username: 'admin', password: '123' });
        expect(ret).toBeTruthy();

        let t = await f.getToken();
        expect(t).toEqual('access');

        fetchMock.mockResponseOnce('123');
        await f.logout();
        t = await f.getToken();
        expect(t).toBeUndefined();
    });
});

test('query2Search', () => {
    expect(query2Search({ str: 'str' })).toEqual('?str=str');
    expect(query2Search({ str: 'str', num: 0, bool: false })).toEqual('?str=str&num=0&bool=false');
    expect(query2Search({ str: ['str'], num: [0,1], bool: false })).toEqual('?str=str&num=0%2C1&bool=false');
    expect(query2Search({})).toEqual('');
});
