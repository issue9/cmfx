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

    test('support', async () => {
        await Locale.support('en', async () => { return { 'lang': 'en' }; });
        expect(Locale.languageSize()).toEqual(1);

        await Locale.support('cmn-Hans', async () => { return { 'lang': 'cmn-Hans' }; });
        expect(Locale.languageSize()).toEqual(2);
    });

    test('t/tt', () => {
        let l = Locale.build('cmn-Hans');
        expect(l).not.toBeUndefined();
        expect(l.tt('cmn-Hans', 'lang')).toEqual('cmn-Hans');
        expect(l.t('lang')).toEqual('cmn-Hans');


        l = Locale.build(); // 默认值
        expect(l).not.toBeUndefined();
        expect(l.t('lang')).toEqual('en');

        l = Locale.build('en');
        expect(l).not.toBeUndefined();
        expect(l.t('lang')).toEqual('en');

        l = Locale.build('en-US');
        expect(l).not.toBeUndefined();
        expect(l.t('lang')).toEqual('en');
    });

    test('locales', () => {
        let l = Locale.build('cmn-Hans');
        expect(l.locales.length).equal(2);
    });
});
