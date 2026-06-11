// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { Description, type DescriptionRef } from './root';

describe('Description', async () => {
	let ref: DescriptionRef;
	const ct = await ComponentTester.build('Description', props => <Description {...props} ref={el => (ref = el)} />);

	test('props', () => ct.testProps());
	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
