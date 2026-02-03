// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ColorPickerPanelHSL } from '@components/color';
import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import ColorPicker from './picker';

describe('ColorPicker', async () => {
	const fa = fieldAccessor('color', 'oklch(1,1,1)');
	const ct = await ComponentTester.build('ColorPicker', props => (
		<ColorPicker pickers={[new ColorPickerPanelHSL()]} accessor={fa} {...props} />
	));

	test('props', () => ct.testProps());
});
