// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Locale as CoreLocale, Dict } from '@cmfx/core';
import { expect, test } from 'vitest';

import { buildLocale } from './locale';

test('buildLocale', async () => {
    CoreLocale.init('zh-Hans');
    await CoreLocale.addDict('zh-Hans', async (): Promise<Dict> => (await import('@/messages/zh-Hans.lang')).default);
    await CoreLocale.addDict('en', async (): Promise<Dict> => (await import('@/messages/en.lang')).default);

    let c = new CoreLocale('zh-Hans', 'full');
    let l = buildLocale(c);
    expect(l.locale.toString()).toEqual('zh-Hans');
    expect(l.unitStyle).toEqual('full');
    expect(l.t('_c.ok')).toEqual('确定');
    expect(l.tt('en', '_c.ok')).toEqual('OK');

    l.changeLocale(new CoreLocale('en', 'short'));
    expect(l.locale.toString()).toEqual('en');
    expect(l.unitStyle).toEqual('short');
    expect(l.t('_c.ok')).toEqual('OK');
    expect(l.tt('zh-Hans', '_c.ok')).toEqual('确定');
    expect(l.bytes(2048)).toEqual('2 kB');

    expect(l.match(['zh', 'en'])).toEqual('en');
});