// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { Button } from '@components/button/button';
import { ComponentTester } from '@components/context/context.spec.tsx';
import { Ref, Root } from './root';

describe('ButtonGroup', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('ButtonGroup', props => (
		<Root
			ref={el => {
				ref = el;
			}}
			{...props}
		>
			<Button.Root>btn1</Button.Root>
		</Root>
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLFieldSetElement);
	});
});
