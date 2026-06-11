// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { Empty, type EmptyRef } from './root';

describe('Empty', async () => {
	let ref: EmptyRef;
	const ct = await ComponentTester.build('Empty', props => <Empty {...props} ref={el => (ref = el)} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeDefined();
	});
});
