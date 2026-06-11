// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { BackTop, type BackTopRef } from './root';

describe('BackTop', async () => {
	let ref: BackTopRef;
	const ct = await ComponentTester.build('BackTop', props => (
		<BackTop {...props} ref={el => (ref = el)}>
			abc
		</BackTop>
	));

	test('ref', async () => {
		expect(ref!.root()).not.toBeUndefined();
	});

	test('props', async () => {
		ct.testProps();
	});
});
