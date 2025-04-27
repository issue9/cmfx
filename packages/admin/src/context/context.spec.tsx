// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { API, Config, Locale } from '@cmfx/core';
import { HashRouter } from '@solidjs/router';
import { describe, expect, test } from 'vitest';

import { buildContext } from './context';
import { options } from './options/options.spec';

describe('context', async () => {
    test('buildContext', async () => {
        const ao = options.api;
        const conf = new Config('admin', '');
        const api = await API.build(conf, ao.base, ao.token, ao.contentType, ao.acceptType, 'zh-Hans');
        Locale.init(conf, 'en', api);
        const ret = await buildContext(options);

        const Root = ()=>{
            expect(ret.ctx.api).toEqual(api);
            expect(ret.ctx.locale()).not.toBeUndefined();
            return <p>root</p>;
        };

        <HashRouter root={Root}></HashRouter>;
    });
});