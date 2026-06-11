// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { Countdown, type CountdownRef } from './root';

describe('Countdown', async () => {
	let ref: CountdownRef;
	const ct = await ComponentTester.build('Countdown', props => (
		<Countdown ref={el => (ref = el)} duration="10s" {...props} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
