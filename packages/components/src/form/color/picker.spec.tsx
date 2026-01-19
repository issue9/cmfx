// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import ColorPicker from './picker';
import { fieldAccessor } from '@components/form/field';
import { ColorPickerPanelHSL } from '@components/color';

describe('ColorPicker', async () => {
    const fa = fieldAccessor('color', 'oklch(1,1,1)');
    const ct = await ComponentTester.build(
        'ColorPicker',
        props => <ColorPicker pickers={[new ColorPickerPanelHSL()]} accessor={fa} {...props} />
    );

    test('props', () => ct.testProps());
});
