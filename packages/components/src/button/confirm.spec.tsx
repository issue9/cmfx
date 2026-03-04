// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { ConfirmButton, Ref } from './confirm';

describe('ConfirmButton', async () => {
	let ref: Ref<false>;
	const ct = await ComponentTester.build('ConfirmButton', props => (
		<ConfirmButton type="button" ref={el => (ref = el)} onclick={() => {}} {...props}>
			button
		</ConfirmButton>
	));

	test('props', () => ct.testProps(ref.button().root()));
	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.button()).toBeDefined();
		expect(ref.popover()).toBeInstanceOf(HTMLDivElement);
	});
});
