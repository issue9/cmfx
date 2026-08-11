// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createTester } from '@components/context/options/context.spec';
import { ClipboardW, type ClipboardWriterRef } from './root';

describe('ClipboardWriter', async () => {
	let ref: ClipboardWriterRef;
	const ct = await createTester('ClipboardWriter', props => <ClipboardW ref={el => (ref = el)} {...props} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref!.root()).toBeDefined();
	});
});
