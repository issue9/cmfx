// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { type Ref, Root } from './root';

describe('Button', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Button', props => (
		<Root
			{...props}
			ref={el => {
				ref = el;
			}}
		>
			button
		</Root>
	));

	test('props', async () => {
		expect(ref!.root()).not.toBeUndefined();
		ct.testProps();
	});
});
