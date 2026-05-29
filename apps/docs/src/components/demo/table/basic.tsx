// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, DataTable, type MountProps } from '@cmfx/components';
import { sleep } from '@cmfx/core';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

interface Item {
	id: number;
	name: string;
	address: string;
}

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [FixedLayout, fixedLayout] = boolSelector('fixedLayout', false);
	const [Nodata, nodata] = boolSelector('nodata', false);

	const items: Array<Item> = [
		{ id: 1, name: 'name1', address: 'address1' },
		{ id: 2, name: 'name2', address: 'address2' },
		{ id: 3, name: 'name3', address: 'address3 这是一行很长的数据，如果 fixedLayout 为 true，那么此行将会换行。' },
		{ id: 4, name: 'name4', address: 'address4' },
		{ id: 5, name: 'name5', address: 'address5' },
		{ id: 6, name: 'name6', address: 'address6' },
	] as const;

	const [chkCol, chkSel] = DataTable.selectionColumn('id');
	const columns: Array<DataTable.Column<Item>> = [
		chkCol,
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
				<Nodata />
				<FixedLayout />
			</Portal>

			<DataTable.Root
				fixedLayout={fixedLayout()}
				palette={palette()}
				load={async () => {
					await sleep(1000);
					return nodata() ? [] : items;
				}}
				columns={columns}
				systemToolbar
				toolbar={
					<Button.Root palette="error" disabled={!chkSel?.length}>
						Delete
					</Button.Root>
				}
			/>
		</>
	);
}
