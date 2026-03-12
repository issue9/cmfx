// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { type Ref, Root } from './root';

describe('ConfirmButton', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('ConfirmButton', props => (
		<Root type="button" ref={el => (ref = el)} onclick={() => {}} {...props}>
			button
		</Root>
	));

	test('props', () => ct.testProps(ref.button().root()));
	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.button()).toBeDefined();
		expect(ref.popover()).toBeInstanceOf(HTMLDivElement);
	});
});
