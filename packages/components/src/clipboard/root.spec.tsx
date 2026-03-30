// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import type { Ref } from './clipboard';
import { Root } from './root';

describe('Clipboard', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Clipboard', props => <Root ref={el => (ref = el)} {...props} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref!.root()).toBeDefined();
	});
});
