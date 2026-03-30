// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ColorPanel } from '@components/color';
import { ComponentTester } from '@components/context/options/context.spec';
import { Form } from '@components/form/form';
import { type Ref, Root } from './root';

describe('ColorPicker', async () => {
	let ref: Ref;
	const fa = Form.fieldAccessor('color', 'oklch(1,1,1)');
	const ct = await ComponentTester.build('ColorPicker', props => (
		<Root pickers={[new ColorPanel.HSLPickerPanel()]} accessor={fa} {...props} ref={el => (ref = el)} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
