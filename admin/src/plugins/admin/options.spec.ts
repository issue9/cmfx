// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { test, expect } from 'vitest';
import {buildOptions, checkMenus} from './options.ts';

test('buildOptions', ()=>{
    const apis = {
        env: '/env',
        login: '/login',
        settings: '/settings',
        info: '/info',
    };


    const o = buildOptions({
        baseURL: 'https://example.com/',
        apis: apis,
        menus: []
    });
    
    expect(o.titleSeparator).toEqual(' | ');
    expect(o.baseURL).toEqual('https://example.com');
    
    expect(()=> {
        buildOptions(buildOptions({
            baseURL: 'localhost',
            apis: apis,
            menus: []
        }));
    }).toThrowError('baseURL 格式错误');
});

test('checkMenus', ()=>{
    expect(()=>{
        checkMenus([], [
            {title: ''},
        ]);
    }).toThrowError('title 不能为空');


    expect(()=>{
        checkMenus([], [
            {title: 't1', key: 't1'},
            {title: 't1', key: 't1'},
        ]);
    }).toThrowError('存在同名的 key: t1');


    expect(()=>{ // 子项与父项存在相同的 key
        checkMenus([], [
            {title: 't1', key: 't1'},
            {title: 't2', key: 't2', items: [
                {title: 't1', key: 't1'},
            ]},
        ]);
    }).toThrowError('存在同名的 key: t1');
});

