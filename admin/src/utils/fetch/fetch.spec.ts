// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { build } from './fetch';

describe('fetch', () => {
    test('build', async () => {
        expect(async () => {
            await build('http://localhost', '/login', 'not-exists', 'zh-CN');
        }).rejects.toThrowError('不支持的 contentType not-exists');

        const f = await build('http://localhost', '/login', 'application/json', 'zh-CN');
        expect(f).not.toBeNull();
    });

    test('buildURL', async () => {
        const f = await build('http://localhost', '/login', 'application/json', 'zh-CN');
        expect(f.buildURL('/path')).toEqual('http://localhost/path');
        expect(f.buildURL('path')).toEqual('http://localhost/path');
        expect(() => { f.buildURL(''); }).toThrowError('参数 path 不能为空');
    });
});
