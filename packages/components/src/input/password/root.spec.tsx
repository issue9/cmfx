// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { InputPassword, type InputPasswordRef } from './root';

describe('InputPassword', async () => {
	let ref: InputPasswordRef;
	const ct = await ComponentTester.build('InputPassword', props => <InputPassword {...props} ref={el => (ref = el)} />);

	test('props', () => ct.testProps());

	test('ref', async () => {
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
		expect(ref.input()).toBeInstanceOf(HTMLInputElement);
	});
});
