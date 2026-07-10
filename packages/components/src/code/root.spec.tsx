// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { Code, type CodeRef } from './root';

describe('Code', async () => {
	let ref: CodeRef;
	const ct = await ComponentTester.build('Code', props => (
		<Code ref={el => (ref = el)} {...props}>
			abc
		</Code>
	));

	test('props', () => ct.testProps(ref.root()));

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeDefined();
	});
});
