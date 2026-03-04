// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import { default as DateRangePicker, Ref } from './range';

describe('DateRangePicker', async () => {
	let ref: Ref;
	const fa = fieldAccessor<[Date, Date], 'date'>('chk', [new Date(), new Date()], 'date');
	const ct = await ComponentTester.build('DateRangePicker', props => (
		<DateRangePicker accessor={fa} {...props} ref={el => (ref = el)} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
