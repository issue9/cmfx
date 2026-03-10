// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { Scheme } from '@components/base';
import { ComponentTester } from '@components/context/context.spec';
import { Ref, Root } from './root';

describe('ThemeSelector', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('ThemeSelector', props => (
		<Root ref={el => (ref = el)} schemes={new Map<string, Scheme>()} value="def" {...props} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
