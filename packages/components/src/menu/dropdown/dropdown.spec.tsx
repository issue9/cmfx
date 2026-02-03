// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { MenuItem } from '../menu/item';
import { default as Dropdown, Ref } from './dropdown';

const items: Array<MenuItem<string>> = [
	{ type: 'item', value: 'v1', label: 'v1-label' },
	{ type: 'item', value: 'v2', label: 'v2-label', disabled: true },
	{ type: 'item', value: 'v3', label: 'v3-label' },
	{ type: 'divider' },
	{
		type: 'group',
		label: 'group-label',
		items: [
			{ type: 'item', value: 'v22', label: 'v22-label' },
			{ type: 'divider' },
			{
				type: 'item',
				value: 'v23',
				label: 'v23-label',
				items: [
					{ type: 'item', value: 'v233', label: 'v233-label' },
					{
						type: 'item',
						label: 'v234-label',
						items: [
							{ type: 'item', value: 'v2341', label: 'v2341-label' },
							{ type: 'item', value: 'v2343', label: 'v2343-label' },
						],
					},
				],
			},
		],
	},
];

describe('Dropdown', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Dropdown', props => (
		<Dropdown
			{...props}
			items={items}
			onChange={() => {}}
			ref={el => {
				ref = el;
			}}
		/>
	));

	test('ref', () => {
		expect(ref!.root()).not.toBeUndefined();
		expect(ref!.menu()).not.toBeUndefined();
	});

	test('props', () => ct.testProps());
});
