// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { API } from '@/api';
import { Config } from '@/config';
import { Locale } from './locale';

describe('Locale', async () => {
    const c = new Config('admin', '');
    const api = await API.build(c, 'https://api.example.com', 'token', 'application/json', 'application/json', 'zh-Hans');

    Locale.init(c, 'en', api);
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

        let l = new Locale(); // 默认值
        expect(l).not.toBeUndefined();

        Locale.switchLocale('cmn-Hans');
        Locale.switchUnitStyle('narrow');
        l = new Locale();
        expect(l).not.toBeUndefined();
        expect(l.tt('cmn-Hans', 'lang')).toEqual('cmn-Hans');
        expect(l.t('lang')).toEqual('cmn-Hans');

        Locale.switchLocale('en');
        l = new Locale();
        expect(l).not.toBeUndefined();
        expect(l.t('lang')).toEqual('en-US');

        Locale.switchLocale('en-US');
        expect(l).not.toBeUndefined();
        expect(l.t('lang')).toEqual('en-US');
    });

    test('locales', () => {
        Locale.switchLocale('cmn-Hans');
        Locale.switchUnitStyle('short');
        const l = new Locale();
        expect(l.locales.length).equal(2);
    });

    test('bytes', () => {
        Locale.switchLocale('en');
        Locale.switchUnitStyle('full');
        const l = new Locale();
        expect(l.bytes(1022)).equal('1,022 bytes');
        expect(l.bytes(1026)).equal('1.002 kilobytes');
        expect(l.bytes(10261111)).equal('9.786 megabytes');
        expect(l.bytes(9999261111)).equal('9.313 gigabytes');
        expect(l.bytes(99998888261111)).equal('90.948 terabytes');
    });

    test('duration', () => {
        Locale.switchLocale('en');
        Locale.switchUnitStyle('narrow');
        const l = new Locale();
        expect(l.duration(111), '111ns');
        expect(l.duration(11111111111), '111.111ms');
    });

    test('date', ()=>{
        Locale.switchLocale('en');
        Locale.switchUnitStyle('short');
        const l = new Locale();
        expect(l.date('2021-01-02'), '2021-01-02');
    });

    test('datetime', ()=>{
        Locale.switchLocale('en');
        Locale.switchUnitStyle('short');
        const l = new Locale();
        expect(l.datetime('2021-01-02 1:2'), '2021-01-02 1:2');
    });
});
