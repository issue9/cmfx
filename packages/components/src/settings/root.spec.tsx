// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createTester } from '@components/context/options/context.spec';
import { Settings, type SettingsRef } from './root';

describe('Settings', async () => {
	let ref: SettingsRef;
	const ct = await createTester('Settings', props => <Settings ref={el => (ref = el)} {...props} />);

	test('props', () => ct.testProps());
	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root).toBeDefined();
	});
});
