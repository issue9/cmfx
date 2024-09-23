// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { API } from '../api';
import { Locale } from './locale';

describe('Locale', async () => {
    const api = await API.build('http:/localhost/api', '/login', 'application/json', 'en');

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
        let l = Locale.build('cmn-Hans');
        expect(l).not.toBeUndefined();
        expect(l.tt('cmn-Hans', 'lang')).toEqual('cmn-Hans');
        expect(l.t('lang')).toEqual('cmn-Hans');


        l = Locale.build(); // 默认值
        expect(l).not.toBeUndefined();
        expect(l.t('lang')).toEqual('en-US');

        l = Locale.build('en');
        expect(l).not.toBeUndefined();
        expect(l.t('lang')).toEqual('en-US');

        l = Locale.build('en-US');
        expect(l).not.toBeUndefined();
        expect(l.t('lang')).toEqual('en-US');
    });

    test('locales', () => {
        const l = Locale.build('cmn-Hans');
        expect(l.locales.length).equal(2);
    });

    test('bytes', () => {
        const l = Locale.build('en');
        expect(l.bytes(1022)).equal('1,022B');
        expect(l.bytes(1026)).equal('1.002kB');
        expect(l.bytes(10261111)).equal('9.786MB');
        expect(l.bytes(9999261111)).equal('9.313GB');
        expect(l.bytes(99998888261111)).equal('90.948TB');
    });

    test('duration', () => {
        const l = Locale.build('en');
        expect(l.duration(111), '111ns');
        expect(l.duration(11111111111), '111.111ms');
    });
});
