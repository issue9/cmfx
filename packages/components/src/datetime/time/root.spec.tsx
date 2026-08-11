// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createTester } from '@components/context/options/context.spec';
import { Time, type TimeRef } from './root';

describe('Time.Panel', async () => {
	let ref: TimeRef<false>;
	const ct = await createTester('Time.Panel', props => <Time ref={el => (ref = el)} {...props} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLFieldSetElement);
	});
});

describe('Time.Popover', async () => {
	let ref: TimeRef<true>;
	const ct = await createTester('Time.Popover', props => <Time popover="click" ref={el => (ref = el)} {...props} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
