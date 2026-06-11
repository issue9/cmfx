// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { RadioGroup, type RadioGroupRef } from './root';

describe('RadioGroup', async () => {
	let ref: RadioGroupRef;
	const ct = await ComponentTester.build('RadioGroup', props => (
		<RadioGroup options={[]} {...props} ref={el => (ref = el)} />
	));

	test('props', () => ct.testProps());

	test('role', () => {
		const root = ct.result.container.firstElementChild!;
		expect(root).toHaveProperty('role', 'radiogroup');
	});

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
