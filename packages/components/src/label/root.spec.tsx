// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createTester } from '@components/context/options/context.spec';
import { Label, type LabelRef } from './root';

describe('Label', async () => {
	let ref: LabelRef;
	const ct = await createTester('Label', props => <Label {...props} ref={el => (ref = el)} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeDefined();
	});
});
