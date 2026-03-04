// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ColorPickerPanelHSL } from '@components/color';
import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import ColorPicker, { Ref } from './picker';

describe('ColorPicker', async () => {
	let ref: Ref;
	const fa = fieldAccessor('color', 'oklch(1,1,1)');
	const ct = await ComponentTester.build('ColorPicker', props => (
		<ColorPicker pickers={[new ColorPickerPanelHSL()]} accessor={fa} {...props} ref={el => (ref = el)} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
