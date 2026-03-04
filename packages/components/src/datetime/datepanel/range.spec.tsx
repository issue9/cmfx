// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { DateRangePanel, Ref } from './range';

describe('DateRangePanel', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('DateRangePanel', props => (
		<DateRangePanel ref={el => (ref = el)} {...props} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLFieldSetElement);
	});
});
