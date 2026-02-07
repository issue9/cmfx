// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Dropdown, MenuItem, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('primary');

	const items: Array<MenuItem<string>> = [
		{ type: 'item', value: 'v1', label: 'v1', prefix: <IconFace />, disabled: true },
		{ type: 'item', value: 'v2', label: 'v2' },
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
							value: 'v234',
							label: 'v234',
							items: [
								{ type: 'item', value: 'v2341', label: 'v2341' },
								{ type: 'item', value: 'v2342', label: 'v2342' },
							],
						},
					],
				},
			],
		},
		{ type: 'item', value: 'v3', label: 'v3' },
		{
			type: 'item',
			value: 'v4',
			label: '很长很长很长的标题-v4',
			prefix: <IconFace />,
			items: [
				{ type: 'item', value: 'v41', label: 'v41' },
				{ type: 'divider' },
				{
					type: 'item',
					value: 'v42',
					label: 'v42',
					prefix: <IconFace />,
					items: [
						{ type: 'item', value: 'v421', label: '很长很长很长的标题-v421' },
						{ type: 'divider' },
						{ type: 'item', value: 'v423', label: 'v423' },
					],
				},
			],
		},
	];

	return (
		<div>
			<Portal mount={props.mount}>
				<Palette />
			</Portal>

			<Dropdown palette={palette()} items={items} trigger="click" onPopover={() => true}>
				<div class="h-10 w-10 bg-primary-bg text-primary-fg">click</div>
			</Dropdown>
		</div>
	);
}
