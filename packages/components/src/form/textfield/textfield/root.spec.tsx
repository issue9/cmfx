// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { Form } from '@components/form/form';
import { type Ref, Root } from './root';

describe('TextField', async () => {
	let ref: Ref;
	const fa = Form.fieldAccessor('tf', 'textfield');
	const ct = await ComponentTester.build('TextField', props => (
		<Root accessor={fa} {...props} ref={el => (ref = el)} />
	));

	test('ref', async () => {
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
		expect(ref.input()).toBeInstanceOf(HTMLInputElement);
	});

	test('props', () => ct.testProps());
});
