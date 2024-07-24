// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { Fetcher } from './fetch';

describe('fetch', () => {
    test('build', async () => {
        expect(async () => {
            await Fetcher.build('http://localhost', '/login', 'not-exists', 'zh-cn');
        }).rejects.toThrowError('不支持的 contentType not-exists');

        const f = await Fetcher.build('http://localhost', '/login', 'application/json', 'zh-cn');
        expect(f).not.toBeNull();
    });

    test('buildURL', async () => {
        const f = await Fetcher.build('http://localhost', '/login', 'application/json', 'zh-cn');
        expect(f.buildURL('/path')).toEqual('http://localhost/path');
        expect(f.buildURL('path')).toEqual('http://localhost/path');
        expect(() => { f.buildURL(''); }).toThrowError('参数 path 不能为空');
    });
});
