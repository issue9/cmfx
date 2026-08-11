// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createTester } from '@components/context/options/context.spec';
import { DatePicker, type DatePickerRef } from './root';

describe('DatePicker.Panel', async () => {
	let ref: DatePickerRef<false>;
	const ct = await createTester('DatePicker.Panel', props => <DatePicker ref={el => (ref = el)} {...props} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLFieldSetElement);
	});
});

describe('DatePicker.Popover', async () => {
	let ref: DatePickerRef<true>;
	const ct = await createTester('DatePicker.Popover', props => (
		<DatePicker popover="click" ref={el => (ref = el)} {...props} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
