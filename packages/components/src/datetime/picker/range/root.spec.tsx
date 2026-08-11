// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createTester } from '@components/context/options/context.spec';
import { DateRangePicker, type DateRangePickerRef } from './root';

describe('DateRangePicker.Panel', async () => {
	let ref: DateRangePickerRef<false>;
	const ct = await createTester('DateRangePicker.Panel', props => (
		<DateRangePicker ref={el => (ref = el)} {...props} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLFieldSetElement);
	});
});

describe('DateRangePicker.Popover', async () => {
	let ref: DateRangePickerRef<true>;
	const ct = await createTester('DateRangePicker.Popover', props => (
		<DateRangePicker popover="click" ref={el => (ref = el)} {...props} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
