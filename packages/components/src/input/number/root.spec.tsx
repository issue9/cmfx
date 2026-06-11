// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { InputNumber, type InputNumberRef } from './root';

describe('InpuNumber', async () => {
	let ref: InputNumberRef;
	const ct = await ComponentTester.build('InpuNumber', props => <InputNumber {...props} ref={el => (ref = el)} />);

	test('props', () => ct.testProps());

	test('ref', async () => {
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
		expect(ref.input()).toBeInstanceOf(HTMLInputElement);
	});
});
