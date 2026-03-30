// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { type Ref, Root } from './root';

describe('Drawer', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Drawer', props => (
		<Root {...props} main={<div>main</div>} ref={el => (ref = el)}>
			aside
		</Root>
	));

	test('ref', async () => {
		expect(ref!.root()).not.toBeUndefined();
		expect(ref!.aside()).not.toBeUndefined();
		expect(ref!.main()).not.toBeUndefined();
	});

	test('props', () => ct.testProps());
});
