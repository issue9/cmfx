// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { default as Code, Ref } from './code';

describe('Code', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Code', props => (
		<Code
			ref={el => {
				ref = el;
			}}
			{...props}
		>
			abc
		</Code>
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeDefined();
	});
});
