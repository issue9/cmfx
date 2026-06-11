// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { InputText, type InputTextRef } from './root';

describe('InputText', async () => {
	let ref: InputTextRef;
	const ct = await ComponentTester.build('InputText', props => <InputText {...props} ref={el => (ref = el)} />);

	test('ref', async () => {
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
		expect(ref.input()).toBeInstanceOf(HTMLInputElement);
	});

	test('props', () => ct.testProps());
});
