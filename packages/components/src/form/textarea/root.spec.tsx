// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import { Ref, Root } from './root';

describe('TextArea', async () => {
	let ref: Ref;
	const fa = fieldAccessor('tf', 'textarea');
	const ct = await ComponentTester.build('TextArea', props => <Root accessor={fa} {...props} ref={el => (ref = el)} />);

	test('props', () => ct.testProps());

	test('ref', async () => {
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
		expect(ref.textarea()).toBeInstanceOf(HTMLTextAreaElement);
	});
});
