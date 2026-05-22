// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';
import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import type { WeekValueType } from '@components/datetime';
import { type Ref, Root } from './week';

describe('WeekPicker', async () => {
	let ref: Ref;
	const [value, setValue] = createSignal<WeekValueType>([2025, 13]);
	const ct = await ComponentTester.build('WeekPicker', props => (
		<Root {...props} ref={el => (ref = el)} value={value()} onChange={setValue} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
