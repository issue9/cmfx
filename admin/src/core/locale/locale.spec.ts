// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { API } from '@/core/api';
import { Config } from '@/core/config';
import { Locale } from './locale';

describe('Locale', async () => {
    const api = await API.build(sessionStorage, 'https://api.example.com', 'token', 'application/json', 'zh-Hans');
    const c = new Config('');

    Locale.init('en', api);
    expect(Locale.languageSize()).toEqual(0);

    test('addDict', async () => {
        await Locale.addDict('en', async () => { return { 'lang': 'en' }; });
        expect(Locale.languageSize()).toEqual(1);

        await Locale.addDict('cmn-Hans', async () => { return { 'lang': 'cmn-Hans' }; });
        expect(Locale.languageSize()).toEqual(2);

        await Locale.addDict('en', async () => { return { 'lang': 'en-US' }; });
        expect(Locale.languageSize()).toEqual(2);
    });

    test('t/tt', () => {
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
