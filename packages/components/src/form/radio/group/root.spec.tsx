// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { Form } from '@components/form/form';
import { type Ref, Root } from './root';

describe('RadioGroup', async () => {
	let ref: Ref;
	const fa = Form.fieldAccessor('chk', '1');
	const ct = await ComponentTester.build('RadioGroup', props => (
		<Root options={[]} accessor={fa} {...props} ref={el => (ref = el)} />
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
