// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Input, Ref } from './input';

describe('Input', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Input', props => (
		<Input
			{...props}
			onChange={() => {}}
			ref={el => {
				ref = el;
			}}
		/>
	));

	test('ref', () => {
		expect(ref!.root()).not.toBeUndefined();
		expect(ref!.input()).not.toBeUndefined();
	});

	test('props', () => ct.testProps());
});
