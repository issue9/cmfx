// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { API } from '@components/form/api';
import { Form, type Ref } from './form';

describe('Form', async () => {
	let ref: Ref;
	const api = new API({
		initValue: {},
		submit: async (v: object) => ({ ok: true, status: 200, body: v }),
	});

	const ct = await ComponentTester.build('Form', props => (
		<Form {...props} api={api} ref={el => (ref = el)}>
			abc
		</Form>
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLFormElement);
	});
});
