// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { API } from '@/api';
import { Config } from '@/config';
import { Locale } from './locale';

describe('Locale', async () => {
    const api = await API.build('cmfx-admin', 'https://api.example.com', 'token', 'application/json', 'application/json', 'zh-Hans', sessionStorage);
    const c = new Config('');

    Locale.init('en', api);
    expect(Locale.languageSize()).toEqual(0);

    test('addDict', async () => {
        await Locale.addDict('en', async () => { return { 'lang': 'en' }; });
        expect(Locale.languageSize()).toEqual(1);

        await Locale.addDict('cmn-Hans', async () => { return { 'lang': 'cmn-Hans' }; });
        expect(Locale.languageSize()).toEqual(2);

        await Locale.addDict('en', async () => { return { 'lang': { '1': { '11': '11' } } }; });
        expect(Locale.languageSize()).toEqual(2);
        expect(Locale.translate('en', 'lang.1.11')).toEqual('11');

        await Locale.addDict('en', async () => { return { 'lang': { '1': { '22': '22' } } }; });
        expect(Locale.languageSize()).toEqual(2);
        expect(Locale.translate('en', 'lang.1.11')).toEqual('11');
        expect(Locale.translate('en', 'lang.1.22')).toEqual('22');// 应该是合并而不是覆盖

        // 一次传递多个加载函数，应该是合并而不是覆盖
        await Locale.addDict('en', 
            async () => { return { 'lang': { '2': { '11': '11' } } }; },
            async () => { return { 'lang': { '2': { '22': '22' } } }; },
        );
        expect(Locale.translate('en', 'lang.2.11')).toEqual('11');
        expect(Locale.translate('en', 'lang.2.22')).toEqual('22');
    });

    test('t/tt', async () => {
        await Locale.addDict('en', async () => { return { 'lang': 'en-US' }; });

        let l = new Locale(c, 'cmn-Hans', 'narrow');
        expect(l).not.toBeUndefined();
        expect(l.tt('cmn-Hans', 'lang')).toEqual('cmn-Hans');
        expect(l.t('lang')).toEqual('cmn-Hans');

        l = new Locale(c); // 默认值
        expect(l).not.toBeUndefined();

        l = new Locale(c, 'en');
        expect(l).not.toBeUndefined();
        expect(l.t('lang')).toEqual('en-US');

        l = new Locale(c, 'en-US');
        expect(l).not.toBeUndefined();
        expect(l.t('lang')).toEqual('en-US');
    });

    test('locales', () => {
        const l = new Locale(c, 'cmn-Hans', 'short');
        expect(l.locales.length).equal(2);
    });

    test('bytes', () => {
        const l = new Locale(c, 'en', 'full');
        expect(l.bytes(1022)).equal('1,022 bytes');
        expect(l.bytes(1026)).equal('1.002 kilobytes');
        expect(l.bytes(10261111)).equal('9.786 megabytes');
        expect(l.bytes(9999261111)).equal('9.313 gigabytes');
        expect(l.bytes(99998888261111)).equal('90.948 terabytes');
    });

    test('duration', () => {
        const l = new Locale(c, 'en', 'narrow');
        expect(l.duration(111), '111ns');
        expect(l.duration(11111111111), '111.111ms');
    });

    test('date', ()=>{
        const l = new Locale(c, 'en', 'short');
        expect(l.date('2021-01-02'), '2021-01-02');
    });

    test('datetime', ()=>{
        const l = new Locale(c, 'en', 'short');
        expect(l.datetime('2021-01-02 1:2'), '2021-01-02 1:2');
    });
});
