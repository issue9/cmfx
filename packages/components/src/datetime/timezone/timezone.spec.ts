// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { buildLocaleRegion } from './timezone';

test('buildLocaleRegion', async () => {
    const enUS = buildLocaleRegion(new Intl.Locale('en-US'), 'full');
    const zhHans = buildLocaleRegion(new Intl.Locale('zh-Hans'), 'full');

    expect(enUS.length).toEqual(zhHans.length);
    expect(enUS.length).toBeGreaterThan(3);
});
