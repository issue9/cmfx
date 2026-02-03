// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { buildRenderItemType, MenuItem } from './item';

const items: Array<MenuItem<string>> = [
	{ type: 'item', value: 'v1', label: 'v1' },
	{ type: 'item', value: 'v2', label: 'v2', disabled: true },
	{ type: 'item', value: 'v3', label: 'v3' },
	{ type: 'divider' },
	{
		type: 'group',
		label: 'group',
		items: [
			{ type: 'item', value: 'v22', label: 'v22' },
			{ type: 'divider' },
			{
				type: 'item',
				value: 'v23',
				label: 'v23',
				items: [
					{ type: 'item', value: 'v233', label: 'v233' },
					{
						type: 'item',
						label: 'v234',
						items: [
							{ type: 'item', value: 'v2341', label: 'v2341' },
							{ type: 'item', value: 'v2343', label: 'v2343' },
						],
					},
				],
			},
		],
	},
];

test('buildRenderItemType', () => {
	const items1 = buildRenderItemType(structuredClone(items), 0);

	expect(items1).toStrictEqual([
		{ type: 'item', value: 'v1', label: 'v1', items: undefined, level: 0 },
		{ type: 'item', value: 'v2', label: 'v2', items: undefined, level: 0, disabled: true },
		{ type: 'item', value: 'v3', label: 'v3', items: undefined, level: 0 },
		{ type: 'divider' },
		{
			type: 'group',
			label: 'group',
			items: [
				{ type: 'item', value: 'v22', label: 'v22', items: undefined, level: 0 },
				{ type: 'divider' },
				{
					type: 'item',
					value: 'v23',
					label: 'v23',
					level: 0,
					items: [
						{ type: 'item', value: 'v233', label: 'v233', level: 1, items: undefined },
						{
							type: 'item',
							label: 'v234',
							level: 1,
							items: [
								{ type: 'item', value: 'v2341', level: 2, items: undefined, label: 'v2341' },
								{ type: 'item', value: 'v2343', level: 2, items: undefined, label: 'v2343' },
							],
						},
					],
				},
			],
		},
	]);
});
