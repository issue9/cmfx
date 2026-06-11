// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { Slider, type SliderRef } from './root';

describe('Slider', async () => {
	let ref: SliderRef;
	const ct = await ComponentTester.build('Slider', props => <Slider {...props} ref={el => (ref = el)} />);

	test('ref', async () => {
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
		expect(ref.input()).toBeInstanceOf(HTMLInputElement);
	});

	test('props', () => ct.testProps());
});
