// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import type { WeekValueType } from '@components/datetime';
import { Form } from '@components/form/form';
import { type Ref, Root } from './week';

describe('WeekPicker', async () => {
	let ref: Ref;
	const fa = Form.fieldAccessor<WeekValueType>('chk', [2025, 13]);
	const ct = await ComponentTester.build('WeekPicker', props => (
		<Root accessor={fa} {...props} ref={el => (ref = el)} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
