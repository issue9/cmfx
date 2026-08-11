// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createTester } from '@components/context/options/context.spec';
import { PaginationBar, type PaginationBarRef } from './root';

describe('PaginationBar', async () => {
	let ref: PaginationBarRef;
	const ct = await createTester('PaginationBar', props => (
		<PaginationBar total={20} page={1} ref={el => (ref = el)} {...props} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeDefined();
	});
});
