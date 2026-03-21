// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Form } from '@components/form/form';
import { type Ref, Root } from './root';

describe('Password', async () => {
	let ref: Ref;
	const fa = Form.fieldAccessor('tf', 'tf');
	const ct = await ComponentTester.build('Password', props => <Root accessor={fa} {...props} ref={el => (ref = el)} />);

	test('props', () => ct.testProps());

	test('ref', async () => {
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
		expect(ref.input()).toBeInstanceOf(HTMLInputElement);
	});
});
