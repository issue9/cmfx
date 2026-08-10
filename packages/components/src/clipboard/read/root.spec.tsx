// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { ClipboardR, type ClipboardReaderRef } from './root';

describe('ClipboardReader', async () => {
	let ref: ClipboardReaderRef;
	const ct = await ComponentTester.build('ClipboardReader', props => <ClipboardR ref={el => (ref = el)} {...props} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref!.root()).toBeDefined();
	});
});
