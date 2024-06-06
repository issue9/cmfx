// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import {expect, test} from 'vitest';
import { checkAPIs } from './apis.ts';

test('checkAPIs', ()=>{
    const apis = {
        env: '/env',
        login: '/login',
        settings: '/settings',
        info: '/info',
    };
    expect(()=>{
        checkAPIs(Object.assign({}, apis, {login:''}));
    }).toThrowError('apis.login');


    expect(()=>{
        checkAPIs(Object.assign({}, apis, {info:''}));
    }).toThrowError('apis.info');


    const o = Object.assign({}, apis, {info:'info'});
    checkAPIs(o);
    expect(o.info).toEqual('/info');
});
