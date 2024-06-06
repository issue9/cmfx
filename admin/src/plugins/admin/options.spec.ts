// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import {test, expect } from 'vitest';
import { buildOptions, checkMenus, checkAPIs } from './options.ts';
import localforage from 'localforage';

test('buildOptions', async ()=>{
    const apis = {
        login: '/login',
        settings: '/settings',
        info: '/info',
    };
    
    await localforage.clear();

    let o = await buildOptions({
        baseURL: 'https://example.com/',
        apis: apis,
        menus: [],
        title: 'title',
        logo: 'logo'
    });
    expect(o.titleSeparator).toEqual(' | ');
    expect(o.baseURL).toEqual('https://example.com');

    await localforage.clear();
    expect(buildOptions({
        baseURL: 'localhost',
        apis: apis,
        menus: [],
        title: 'title',
        logo: 'logo'
    })).rejects.toThrowError('baseURL 格式错误');

    await localforage.clear();
    expect(buildOptions({
        baseURL: 'https://localhost',
        apis: apis,
        menus: [],
        title: '',
        logo: 'logo'
    })).rejects.toThrowError('title 不能为空');

    await localforage.clear();
    expect(buildOptions({
        baseURL: 'https://localhost',
        apis: apis,
        menus: [],
        title: 'title',
        logo: ''
    })).rejects.toThrowError('logo 不能为空');

    await localforage.clear();
    await buildOptions({
        baseURL: 'https://localhost',
        apis: apis,
        menus: [],
        title: 'title',
        logo: 'logo'
    });
    o = await buildOptions({
        baseURL: 'https://localhost',
        apis: apis,
        menus: [],
        title: 't1',
        logo: 'l1'
    });
    expect(o.logo).toEqual('logo');
    expect(o.title).toEqual('title');
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

test('checkAPIs', ()=>{
    const apis = {
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
