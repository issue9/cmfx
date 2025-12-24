// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { buildLocaleRegion, buildRegion, default as Timezone } from './timezone';

describe('region', () => {
    const regions = buildRegion();

    test('buildRegion', () => {
        expect(regions.length).toBeGreaterThan(3); // 每个浏览器的数量都不同，但是肯定是有数量的
    });

    test('buildLocaleRegion', () => {
        const enUS = buildLocaleRegion(new Intl.Locale('en-US'), 'full');
        const zhHans = buildLocaleRegion(new Intl.Locale('zh-Hans'), 'full');

        const en = enUS.get(regions[0].timezones[0]);
        const cn = zhHans.get(regions[0].timezones[0]);
        expect(en).not.toEqual(cn);
        expect(en).toBeDefined();
        expect(cn).toBeDefined();
    });
});

describe('Timezone', async () => {
    const ct = await ComponentTester.build('Timezone', props => <Timezone {...props} />);

    test('props', async () => {
        ct.testProps();
    });
});
