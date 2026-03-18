// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type BasicTable, Button, LoaderTable, type MountProps, TextField } from '@cmfx/components';
import { type Page, type Query, sleep } from '@cmfx/core';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

interface Item {
	id: number;
	name: string;
	address: string;
}

interface Q extends Query {
	txt: string;
}

function buildItems(start: number, size: number): Array<Item> {
	const items: Array<Item> = [];
	for (let i = start; i < start + size; i++) {
		items.push({ id: i, name: `name ${i}`, address: `address ${i}` });
	}

	return items;
}

const pagingLoader = async (oa: Q): Promise<Page<Item>> => {
	const count = 100;
	await sleep(500);

	if (!oa.size) {
		// 下载没有 size
		return {
			more: false,
			count: 100,
			current: [...buildItems(0, count)],
		};
	}

	const page = oa.page! as number;
	const size = oa.size! as number;

	return {
		more: page * size < count,
		count: count,
		current: [...buildItems((page - 1) * size, size)],
	};
};

export default function (props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector();
	const [FixedLayout, fixedLayout] = boolSelector('fixedLayout', false);
	const [SystemToolbar, systemToolbar] = boolSelector('systemToolbar', true);

	const columns: Array<BasicTable.Column<Item>> = [
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
				<FixedLayout />
				<SystemToolbar />
			</Portal>

			<LoaderTable.Root
				accentPalette="primary"
				paging
				systemToolbar={systemToolbar()}
				inSearch
				fixedLayout={fixedLayout()}
				palette={palette()}
				toolbar={<Button.Root palette="primary">+ New</Button.Root>}
				columns={columns}
				queries={{ txt: 'abc', page: 1, size: 10 }}
				queryForm={oa => (
					<>
						<TextField.Root accessor={oa.accessor<string>('txt')} />
					</>
				)}
				load={pagingLoader}
			/>
		</>
	);
}
