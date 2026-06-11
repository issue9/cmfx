// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { Statistic, type StatisticRef } from './root';

describe('Statistic', async () => {
	let ref: StatisticRef;
	const ct = await ComponentTester.build('Statistic', props => (
		<Statistic label="Label" value={5} {...props} ref={el => (ref = el)} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
