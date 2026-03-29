// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { type Ref, Root } from './basic';

describe('BasicTable', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('BasicTable', props => (
		<Root {...props} columns={[]} ref={el => (ref = el)} />
	));

	test('props', () => ct.testProps());

	test('ref', async () => {
		expect(ref!.root()).not.toBeUndefined();
		expect(ref!.table()).not.toBeUndefined();
	});
});
