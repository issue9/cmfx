// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Locale as CoreLocale, Dict } from '@cmfx/core';
import { describe, expect, test } from 'vitest';

import { Enums, translateEnums } from './enum';
import { buildLocale } from './locale';

describe('enum', async () => {
    CoreLocale.init('zh-Hans');
    await CoreLocale.addDict('zh-Hans', async (): Promise<Dict> => (await import('@/messages/zh-Hans.lang')).default);
    await CoreLocale.addDict('en', async (): Promise<Dict> => (await import('@/messages/en.lang')).default);

    const enums: Enums<string, string> = [
        ['k1', '_c.ok'],
        ['k2', '_c.cancel'],
    ];

    let c = new CoreLocale('zh-Hans', 'full');
    let l = buildLocale(c);

    test('translateEnums', () => {
        expect(translateEnums<string>(enums, l)).toEqual([['k1', '确定'], ['k2', '取消']]);
    });
});
