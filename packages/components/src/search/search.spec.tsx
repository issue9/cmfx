// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { MenuItemItem } from '@components/menu';
import Search, { Ref } from './search';

describe('Search', async () => {
	const search = async (_: string): Promise<Array<MenuItemItem<string>>> => [
		{ type: 'item', value: 'v', label: 'label' },
	];
	let ref: Ref;
	const ct = await ComponentTester.build('Search', props => (
		<Search onSearch={search} {...props} ref={el => (ref = el)} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeDefined();
	});
});
