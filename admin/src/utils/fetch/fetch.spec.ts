// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test, describe } from 'vitest';
import { Fetcher } from './fetch';

describe('fetch', ()=>{
    test('new', ()=>{
        expect(()=>{
            new Fetcher('http://localhost', '/login', 'not-exists', 'zh-CN');
        }).toThrowError('不支持的 mimetype not-exists');

        const f = new Fetcher('http://localhost', '/login', 'application/json', 'zh-CN');
        expect(f).not.toBeNull();
    });

    test('buildURL', ()=>{
        const f = new Fetcher('http://localhost', '/login', 'application/json', 'zh-CN');
        expect(f.buildURL('/path')).toEqual('http://localhost/path');
        expect(f.buildURL('path')).toEqual('http://localhost/path');
        expect(()=>{f.buildURL('');}).toThrowError('参数 path 不能为空');
    });
});

