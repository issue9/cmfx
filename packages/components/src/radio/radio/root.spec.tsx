// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { Radio, type RadioRef } from './root';

describe('Radio', async () => {
	let ref: RadioRef;
	const ct = await ComponentTester.build('Radio', props => <Radio {...props} ref={el => (ref = el)} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLLabelElement);
		expect(ref.input()).toBeInstanceOf(HTMLInputElement);
	});
});
