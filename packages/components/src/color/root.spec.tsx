// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { HSLPickerPanel } from './picker_hsl';
import { type Ref, Root } from './root';

describe('ColorPanel', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('ColorPanel', props => (
		<Root ref={el => (ref = el)} {...props} pickers={[new HSLPickerPanel()]} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
