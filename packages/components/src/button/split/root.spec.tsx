// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { Button } from '@components/button/button';
import { ComponentTester } from '@components/context/options/context.spec';
import { SplitButton, type SplitButtonRef } from './root';

describe('SplitButton', async () => {
	let ref: SplitButtonRef;
	const ct = await ComponentTester.build('SplitButton', props => (
		<SplitButton ref={el => (ref = el)} {...props} items={[]}>
			<Button>btn1</Button>
		</SplitButton>
	));

	test('props', () => {
		ct.testProps();
	});

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeDefined();
		expect(ref.group()).toBeDefined();
	});
});
