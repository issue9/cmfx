// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import type { Scheme } from '@components/base';
import { ComponentTester } from '@components/context/options/context.spec';
import { SchemeSelector, type SchemeSelectorRef } from './root';

describe('SchemeSelector', async () => {
	let ref: SchemeSelectorRef;
	const ct = await ComponentTester.build('SchemeSelector', props => (
		<SchemeSelector ref={el => (ref = el)} schemes={new Map<string, Scheme>()} value="def" {...props} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
