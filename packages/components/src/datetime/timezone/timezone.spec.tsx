// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { buildLocaleRegion, default as Timezone } from './timezone';

test('buildLocaleRegion', async () => {
    const enUS = buildLocaleRegion(new Intl.Locale('en-US'), 'full');
    const zhHans = buildLocaleRegion(new Intl.Locale('zh-Hans'), 'full');

    expect(enUS.length).toEqual(zhHans.length);
    expect(enUS.length).toBeGreaterThan(3);
});

describe('Timezone', async () => {
    const ct = await ComponentTester.build('Timezone', props => <Timezone {...props} />);

    test('props', async () => {
        ct.testProps();
    });
});
