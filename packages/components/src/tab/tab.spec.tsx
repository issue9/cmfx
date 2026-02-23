// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Tab } from './tab';
import { Ref } from './types';

describe('Tab', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Tab', props => (
		<Tab
			ref={el => {
				ref = el;
			}}
			items={[{ id: 'id' }]}
			{...props}
		/>
	));

	test('props', () => {
		ct.testProps();
		const root = ct.result.container.firstElementChild as HTMLElement;
		expect(root).toHaveProperty('role', 'tablist');

		expect(ref!.root()).toBeInstanceOf(HTMLDivElement);
	});
});
