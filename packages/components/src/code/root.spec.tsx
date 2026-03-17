// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { type Ref, Root } from './root';

describe('Code', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Code', props => (
		<Root ref={el => (ref = el)} {...props}>
			abc
		</Root>
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeDefined();
	});
});
