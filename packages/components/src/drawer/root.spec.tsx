// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { Drawer, type DrawerRef } from './root';

describe('Drawer', async () => {
	let ref: DrawerRef;
	const ct = await ComponentTester.build('Drawer', props => (
		<Drawer {...props} main={<div>main</div>} ref={el => (ref = el)}>
			aside
		</Drawer>
	));

	test('ref', async () => {
		expect(ref!.root()).not.toBeUndefined();
		expect(ref!.aside()).not.toBeUndefined();
		expect(ref!.main()).not.toBeUndefined();
	});

	test('props', () => ct.testProps());
});
