// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { Card, type CardRef } from './root';

describe('Card', async () => {
	let ref: CardRef;
	const ct = await ComponentTester.build('Card', props => (
		<Card ref={el => (ref = el)} {...props}>
			abc
		</Card>
	));

	test('props', () => ct.testProps());
	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
