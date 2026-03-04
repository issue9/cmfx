// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { default as Calendar, Ref } from './calendar';

describe('Calendar', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Calendar', props => <Calendar {...props} ref={el => (ref = el)} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLTableElement);
	});
});
