// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Ref, Root } from './root';

describe('Checkbox', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Checkbox', props => (
		<Root
			ref={el => {
				ref = el;
			}}
			{...props}
		/>
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLLabelElement);
		expect(ref.input()).toBeInstanceOf(HTMLInputElement);
	});
});
