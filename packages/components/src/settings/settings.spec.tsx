// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Ref, Settings } from './settings';

describe('Settings', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Settings', props => (
		<Settings
			ref={el => {
				ref = el;
			}}
			{...props}
		/>
	));

	test('props', () => ct.testProps());
	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root).toBeDefined();
	});
});
