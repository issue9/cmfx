// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createTester } from '@components/context/options/context.spec';
import { WeekPicker, type WeekPickerRef } from './root';

describe('WeekPicker.Panel', async () => {
	let ref: WeekPickerRef<false>;
	const ct = await createTester('WeekPicker.Panel', props => <WeekPicker ref={el => (ref = el)} {...props} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLFieldSetElement);
	});
});

describe('WeekPicker.Popover', async () => {
	let ref: WeekPickerRef<true>;
	const ct = await createTester('WeekPicker.Popover', props => (
		<WeekPicker popover="click" ref={el => (ref = el)} {...props} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
