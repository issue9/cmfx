// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { type Ref, Root } from './root';
import { HSLSpace } from './space_hsl';

describe('Color.Panel', async () => {
	let ref: Ref<false>;
	const ct = await ComponentTester.build('Color.Panel', props => (
		<Root ref={el => (ref = el)} {...props} spaces={[new HSLSpace()]} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});

describe('Color.Popover', async () => {
	let ref: Ref<true>;
	const ct = await ComponentTester.build('Color.Popover', props => (
		<Root popover ref={el => (ref = el)} {...props} spaces={[new HSLSpace()]} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
