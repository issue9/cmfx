// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { nano2IntlDuration } from '@/time';
import { I18n } from './i18n';

describe('i18n', async () => {
    I18n.init('en');
    expect(I18n.languageSize()).toEqual(0);

    test('createObject', () => {
        const obj1 = I18n.createObject('test---id');
        obj1.set('zh', { 'lang': 'zh' });
        expect(obj1.get('zh')).toEqual({ 'lang': 'zh' });
        obj1.destroy();

        const obj2 = I18n.createObject('test---id');
        expect(obj2.get('zh', () => ({ 'lang': 'zh' }))).toEqual({ 'lang': 'zh' });
        obj2.destroy('zh');
        expect(obj2.get('zh')).toBeUndefined();
    });

    test('addDict', async () => {
        await I18n.addDict('en', async () => { return { 'lang': 'en' }; });
        expect(I18n.languageSize()).toEqual(1);

        await I18n.addDict('cmn-Hans', async () => { return { 'lang': 'cmn-Hans' }; });
        expect(I18n.languageSize()).toEqual(2);

        await I18n.addDict('en', async () => { return { 'lang': { '1': { '11': '11' } } }; });
        expect(I18n.languageSize()).toEqual(2);
        expect(I18n.translate('en', 'lang.1.11')).toEqual('11');

        await I18n.addDict('en', async () => { return { 'lang': { '1': { '22': '22' } } }; });
        expect(I18n.languageSize()).toEqual(2);
        expect(I18n.translate('en', 'lang.1.11')).toEqual('11');
        expect(I18n.translate('en', 'lang.1.22')).toEqual('22');// 应该是合并而不是覆盖

        // 一次传递多个加载函数，应该是合并而不是覆盖
        await I18n.addDict('en',
            async () => { return { 'lang': { '2': { '11': '11' } } }; },
            async () => { return { 'lang': { '2': { '22': '22' } } }; },
            async () => { return undefined; },
        );
        expect(I18n.translate('en', 'lang.2.11')).toEqual('11');
        expect(I18n.translate('en', 'lang.2.22')).toEqual('22');

        I18n.delDict('en');
        expect(I18n.translate('en', 'lang.2.22')).toEqual('lang.2.22');
    });

    test('t/tt', async () => {
        await I18n.addDict('en', async () => { return { 'lang': 'en-US' }; });

        let l = new I18n('cmn-Hans', 'narrow');
        expect(l).not.toBeUndefined();
        expect(l.tt('cmn-Hans', 'lang')).toEqual('cmn-Hans');
        expect(l.t('lang')).toEqual('cmn-Hans');

        l = new I18n('en', 'full');
        expect(l).not.toBeUndefined();
        expect(l.t('lang')).toEqual('en-US');

        l = new I18n('en-US', 'full');
        expect(l).not.toBeUndefined();
        expect(l.t('lang')).toEqual('en-US');
    });

    test('locales', () => {
        const l = new I18n('cmn-Hans', 'short');
        expect(l.locales.length).equal(2);
    });

    test('duration', () => {
        const l = new I18n('en', 'narrow');
        expect(l.durationFormat().format(nano2IntlDuration(111)), '111ns');
        expect(l.durationFormat().format(nano2IntlDuration(11111111111)), '111.111ms');
    });

    test('date', () => {
        const l = new I18n('en', 'short');
        expect(l.dateFormat({dateStyle: 'short'})
            .format(new Date('2021-01-02')), '2021-01-02');
    });

    test('datetime', () => {
        const l = new I18n('en', 'short');
        expect(l.datetimeFormat().format(new Date('2021-01-02 1:2')), '2021-01-02 1:2');
    });
});
