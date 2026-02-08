// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Menu, MenuItem, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { arraySelector, paletteSelector } from '@docs/components/base';
import styles from './style.module.css';

function selectedClassSelector(preset?: string) {
	return arraySelector(
		'selected class',
		new Map([
			[styles.selected, 'selected'],
			['', '空'],
		]),
		preset,
	);
}

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('primary');
	const [SelectedCls, selectedCls] = selectedClassSelector(undefined);

	const items: Array<MenuItem<string>> = [
		{ type: 'a', value: 'v1', label: 'v1', prefix: <IconFace />, disabled: true },
		{ type: 'a', value: 'v2', label: 'v2' },
		{ type: 'divider' },
		{
			type: 'group',
			label: 'group',
			items: [
				{ type: 'a', value: 'v22', label: 'v22' },
				{ type: 'divider' },
				{
					type: 'a',
					value: 'v23',
					label: 'v23',
					items: [
						{ type: 'a', value: 'v233', label: 'v233' },
						{
							type: 'a',
							value: 'v234',
							label: 'v234',
							items: [
								{ type: 'a', value: 'v2341', label: 'v2341' },
								{ type: 'a', value: 'v2342', label: 'v2342' },
								{ type: 'divider' },
								{ type: 'a', value: 'v2343', label: 'v2343' },
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
						{ type: 'item', value: 'v422', label: 'v422' },
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
				<SelectedCls />
			</Portal>

			<Menu selectedClass={selectedCls()} palette={palette()} items={items} />
		</div>
	);
}
