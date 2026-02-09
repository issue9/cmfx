// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { MenuItem } from './item';
import { default as Menu, Ref, selectedElements } from './menu';

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

describe('Menu', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Menu', props => (
		<Menu
			{...props}
			multiple
			items={items}
			value={['v1', 'v233']}
			ref={el => {
				ref = el;
			}}
		/>
	));

	test('ref', async () => {
		expect(ref!.root()).not.toBeUndefined();
	});

	test('props', () => ct.testProps());
});

describe('selectedElements', async () => {
	const els = (
		<menu id="root">
			<li>
				<button type="button" role="menuitemcheckbox" aria-checked="true">
					v1-label
				</button>
			</li>
			<li>
				v2-label
				<ul>
					<li>
						v23-label
						<ul>
							<li>
								<button type="button" role="menuitemcheckbox" aria-checked="true">
									v231-label
								</button>
							</li>
							<li>v232-label</li>
						</ul>
					</li>
					<li>v24-label</li>
				</ul>
			</li>
		</menu>
	);

	// 需要加载到 DOM，否则测试失败！
	const { unmount } = render(() => els);

	test('!root', () => {
		const el = selectedElements(els as HTMLElement);
		expect(el).toHaveLength(2);
		expect(el[0]).toHaveTextContent('v1-label');
		expect(el[1]).toHaveTextContent('v231-label');
	});

	test('root', () => {
		const el = selectedElements(els as HTMLElement, true);
		expect(el).toHaveLength(2);
		expect(el[0]).toHaveTextContent('v1-label');
		// 包含了所有子节点的文本，根节点在最前，group 类型不参与计算。
		expect(el[1].textContent?.trim().startsWith('v2-label')).toBe(true);
	});

	unmount();
});
