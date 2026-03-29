// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import type { Menu } from '@components/menu';
import { type Ref, Root } from './root';

describe('Search', async () => {
	const search = async (_: string): Promise<Array<Menu.MenuItem>> => [{ type: 'item', value: 'v', label: 'label' }];
	let ref: Ref;
	const ct = await ComponentTester.build('Search', props => (
		<Root onSearch={search} {...props} ref={el => (ref = el)} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeDefined();
	});
});
