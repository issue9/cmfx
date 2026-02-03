// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { BasicTable, Button, Column, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

interface Item {
	id: number;
	name: string;
	address: string;
}

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [Loading, loading] = boolSelector('loading', false);
	const [FixedLayout, fixedLayout] = boolSelector('fixedLayout', false);
	const [Nodata, nodata] = boolSelector('nodata', false);

	const items: Array<Item> = [
		{ id: 1, name: 'name1', address: 'address1' },
		{ id: 2, name: 'name2', address: 'address2' },
		{ id: 3, name: 'name3', address: 'address3 这是一行很长的数据，如果 fixedLayout 为 true，那么此行将会换行。' },
		{ id: 4, name: 'name4', address: 'address4' },
		{ id: 5, name: 'name5', address: 'address5' },
		{ id: 6, name: 'name6', address: 'address6' },
	];

	const columns: Array<Column<Item>> = [
		{ id: 'id' },
		{ id: 'name' },
		{ id: 'address' },
		{
			id: 'action',
			renderLabel: 'ACTIONS',
			renderContent: () => {
				return <button type="button">...</button>;
			},
			isUnexported: true,
		},
	];

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<Loading />
				<Nodata />
				<FixedLayout />
			</Portal>

			<BasicTable
				loading={loading()}
				fixedLayout={fixedLayout()}
				palette={palette()}
				items={nodata() ? [] : items}
				columns={columns}
				extraHeader={
					<p class="bg-primary-fg text-primary-bg">
						<Button palette="primary">Button</Button>
					</p>
				}
				extraFooter={<p class="bg-primary-fg text-primary-bg">footer</p>}
			/>
		</>
	);
}
