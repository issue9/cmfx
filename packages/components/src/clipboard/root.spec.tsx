// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import type { ClipboardAPIRef } from './clipboard';
import { ClipboardAPI } from './root';

describe('Clipboard', async () => {
	let ref: ClipboardAPIRef;
	const ct = await ComponentTester.build('Clipboard', props => <ClipboardAPI ref={el => (ref = el)} {...props} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref!.root()).toBeDefined();
	});
});
