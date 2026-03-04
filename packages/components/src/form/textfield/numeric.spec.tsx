// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import { default as Numeric } from './numeric';
import { Ref } from './textfield';

describe('Numeric', async () => {
	let ref: Ref;
	const fa = fieldAccessor('tf', 5);
	const ct = await ComponentTester.build('Numeric', props => (
		<Numeric
			accessor={fa}
			{...props}
			ref={el => {
				ref = el;
			}}
		/>
	));

	test('props', () => ct.testProps());

	test('ref', async () => {
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
		expect(ref.input()).toBeInstanceOf(HTMLInputElement);
	});
});
