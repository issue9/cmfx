// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createTester } from '@components/context/options/context.spec';
import { LockScreen, type LockScreenRef } from './root';

describe('LockScreen', async () => {
	let ref: LockScreenRef;
	const ct = await createTester('LockScreen', props => <LockScreen {...props} ref={el => (ref = el)} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeDefined();
	});
});
