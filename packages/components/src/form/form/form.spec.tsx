// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createTester } from '@components/context/options/context.spec';
import { Form, type FormRef } from './form';

describe('Form', async () => {
	let ref: FormRef;

	const ct = await createTester('Form', props => (
		<Form
			{...props}
			ref={el => (ref = el)}
			initValue={{}}
			submit={async (v: object) => ({ ok: true, status: 200, body: v })}
		>
			abc
		</Form>
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLFormElement);
	});
});
