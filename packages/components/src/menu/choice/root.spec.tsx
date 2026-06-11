// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';
import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { Choice, type ChoiceRef } from './root';

describe('Choice', async () => {
	let ref: ChoiceRef;
	const fa = createSignal('1');
	const ct = await ComponentTester.build('Choice', props => (
		<Choice options={[]} value={fa[0]()} onChange={fa[1]} {...props} ref={el => (ref = el)} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
