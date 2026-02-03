// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { createForm } from './form';

describe('Form', async () => {
	const [_, Form] = createForm({
		initValue: {},
		submit: async (v: object) => ({ ok: true, status: 200, body: v }),
	});

	const ct = await ComponentTester.build('Form', props => <Form {...props}>abc</Form>);

	test('props', () => ct.testProps());
});
