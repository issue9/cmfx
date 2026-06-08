// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { type Ref, Root } from './root';

describe('MonthPanel', async () => {
	let ref: Ref;
	await ComponentTester.build('MonthPanel', props => <Root ref={el => (ref = el)} {...props} />);

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLFieldSetElement);
	});
});
