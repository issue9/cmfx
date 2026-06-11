// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { Checkbox, type CheckboxRef } from './root';

describe('Checkbox', async () => {
	let ref: CheckboxRef;
	const ct = await ComponentTester.build('Checkbox', props => <Checkbox ref={el => (ref = el)} {...props} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLLabelElement);
		expect(ref.input()).toBeInstanceOf(HTMLInputElement);
	});
});
