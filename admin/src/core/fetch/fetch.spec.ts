// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { Locales } from '@/core/locales';
import { build } from './fetch';

describe('fetch', () => {
    const l = new Locales(['zh-Hans', 'zh-cn'], 1);

    test('build', async () => {
        expect(async () => {
            await build('http://localhost', '/login', 'not-exists', l);
        }).rejects.toThrowError('不支持的 contentType not-exists');

        const f = await build('http://localhost', '/login', 'application/json', l);
        expect(f).not.toBeNull();
        expect(f.locales).not.toBeNull();
    });

    test('buildURL', async () => {
        const f = await build('http://localhost', '/login', 'application/json', l);
        expect(f.buildURL('/path')).toEqual('http://localhost/path');
        expect(f.buildURL('path')).toEqual('http://localhost/path');
        expect(() => { f.buildURL(''); }).toThrowError('参数 path 不能为空');
    });
});
