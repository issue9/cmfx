// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { MonthPanel, type MonthPanelRef } from './root.tsx';

describe('MonthPanel', async () => {
	let ref: MonthPanelRef;
	await ComponentTester.build('MonthPanel', props => <MonthPanel ref={el => (ref = el)} {...props} />);

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLFieldSetElement);
	});
});
