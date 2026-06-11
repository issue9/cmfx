// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { InputBase, type InputBaseRef } from './root';

describe('InputBase', async () => {
	let ref: InputBaseRef;
	const ct = await ComponentTester.build('InputBase', props => (
		<InputBase {...props} onChange={() => {}} ref={el => (ref = el)} />
	));

	test('ref', () => {
		expect(ref!.root()).not.toBeUndefined();
		expect(ref!.input()).not.toBeUndefined();
	});

	test('props', () => ct.testProps());
});
