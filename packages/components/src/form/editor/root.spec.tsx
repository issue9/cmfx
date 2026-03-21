// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Form } from '@components/form/form';
import { type Ref, Root } from './root';

describe('Editor', async () => {
	let ref: Ref;
	const fa = Form.fieldAccessor('chk', 'string');
	const ct = await ComponentTester.build('Editor', props => <Root ref={el => (ref = el)} accessor={fa} {...props} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
		expect(ref.quill()).toBeDefined();
	});
});
