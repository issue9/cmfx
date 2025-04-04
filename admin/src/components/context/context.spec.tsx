// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter } from '@solidjs/router';
import { describe, expect, test } from 'vitest';

import { API, Locale } from '@/core';
import { buildContext } from './context';
import { options } from './options/options.spec';

describe('context', async () => {
    test('buildContext', async () => {
        const ao = options.api;
        const api = await API.build(localStorage, ao.base, ao.login, ao.encoding.content, ao.encoding.accept, 'zh-Hans');
        Locale.init('en', api);

        const Root = ()=>{
            const ret = buildContext(options, api);
            expect(ret.ctx.api).toEqual(api);
            expect(ret.ctx.locale()).not.toBeUndefined();
            return <p>root</p>;
        };

        <HashRouter root={Root}></HashRouter>;
    });
});