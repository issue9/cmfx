// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { Button } from '@components/button/button';
import { ComponentTester } from '@components/context/context.spec.tsx';
import { type Ref, Root } from './root';

describe('SplitButton', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('SplitButton', props => (
		<Root
			ref={el => {
				ref = el;
			}}
			{...props}
			items={[]}
		>
			<Button.Root>btn1</Button.Root>
		</Root>
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
