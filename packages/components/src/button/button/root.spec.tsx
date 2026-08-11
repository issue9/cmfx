// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createTester } from '@components/context/options/context.spec';
import { Button, type ButtonRef } from './root';

describe('Button', async () => {
	let ref: ButtonRef;
	const ct = await createTester('Button', props => (
		<Button {...props} ref={el => (ref = el)}>
			button
		</Button>
	));

	test('props', async () => ct.testProps());

	test('ref', () => {
		expect(ref!.root()).toBeDefined();
	});
});
