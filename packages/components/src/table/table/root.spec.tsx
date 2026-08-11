// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createTester } from '@components/context/options/context.spec';
import { Root, type TableRef } from './root';

describe('Table', async () => {
	let ref: TableRef;
	const ct = await createTester('Table', props => <Root {...props} ref={el => (ref = el)} />);

	test('props', () => ct.testProps());

	test('ref', async () => {
		expect(ref!.root()).not.toBeUndefined();
	});
});
