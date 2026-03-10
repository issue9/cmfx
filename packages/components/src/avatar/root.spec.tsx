// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Ref, Root } from './root';

describe('Avatar', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Appbar', props => (
		<Root
			value="../../../assets/brand-static.svg"
			{...props}
			ref={r => {
				ref = r;
			}}
		/>
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
