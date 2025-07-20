// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { toIntlDuration } from '@/time';
import { Locale } from './locale';

describe('Locale', async () => {
    Locale.init('en');
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

        let l = new Locale('cmn-Hans', 'narrow');
        expect(l).not.toBeUndefined();
        expect(l.tt('cmn-Hans', 'lang')).toEqual('cmn-Hans');
        expect(l.t('lang')).toEqual('cmn-Hans');

        l = new Locale('en', 'full');
        expect(l).not.toBeUndefined();
        expect(l.t('lang')).toEqual('en-US');

        l = new Locale('en-US', 'full');
        expect(l).not.toBeUndefined();
        expect(l.t('lang')).toEqual('en-US');
    });

    test('locales', () => {
        const l = new Locale('cmn-Hans', 'short');
        expect(l.locales.length).equal(2);
    });

    test('duration', () => {
        const l = new Locale('en', 'narrow');
        expect(l.durationFormat().format(toIntlDuration(111)), '111ns');
        expect(l.durationFormat().format(toIntlDuration(11111111111)), '111.111ms');
    });

    test('date', () => {
        const l = new Locale('en', 'short');
        expect(l.dateFormat({dateStyle: 'short'})
            .format(new Date('2021-01-02')), '2021-01-02');
    });

    test('datetime', () => {
        const l = new Locale('en', 'short');
        expect(l.datetimeFormat().format(new Date('2021-01-02 1:2')), '2021-01-02 1:2');
    });
});
