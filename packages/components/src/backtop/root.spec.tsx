// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Ref, Root } from './root';

describe('BackTop', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('BackTop', props => (
		<Root
			{...props}
			ref={el => {
				ref = el;
			}}
		>
			abc
		</Root>
	));

	test('ref', async () => {
		expect(ref!.root()).not.toBeUndefined();
	});

	test('props', async () => {
		ct.testProps();
	});
});
