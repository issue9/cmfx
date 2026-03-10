// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import { Ref, Root } from './root';

describe('CheckboxGroup', async () => {
	let ref: Ref;
	const fa = fieldAccessor('chk', ['1']);
	const ct = await ComponentTester.build('CheckboxGroup', props => (
		<Root ref={el => (ref = el)} options={[]} accessor={fa} {...props} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
