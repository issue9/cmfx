// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { buildLocaleRegion, buildRegion, type Ref, Root } from './root';

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
	let ref: Ref;
	const ct = await ComponentTester.build('Timezone', props => <Root {...props} ref={el => (ref = el)} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeDefined();
	});
});
