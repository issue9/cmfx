// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createTester } from '@components/context/options/context.spec';
import { CheckboxGroup, type CheckboxGroupRef } from './root';

describe('CheckboxGroup', async () => {
	let ref: CheckboxGroupRef;
	const ct = await createTester('CheckboxGroup', props => (
		<CheckboxGroup ref={el => (ref = el)} options={[]} {...props} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
