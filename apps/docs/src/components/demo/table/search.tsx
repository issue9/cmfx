// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, DataTable, InputText, type MountProps } from '@cmfx/components';
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

	const columns: Array<DataTable.Column<Item>> = [
		{ label: 'id' },
		{ label: 'name' },
		{ label: 'address' },
		{
			label: 'action',
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

			<DataTable
				paging
				inSearch={{
					to: params => {
						return {
							page: params.page !== undefined ? parseInt(params.page, 10) : 1,
							size: params.size !== undefined ? parseInt(params.size, 10) : 10,
							txt: params.txt ? params.txt : '',
						};
					},
					from: q => {
						return {
							page: q.page?.toString(),
							size: q.size?.toString(),
							txt: q.txt,
						};
					},
				}}
				systemToolbar={systemToolbar()}
				fixedLayout={fixedLayout()}
				palette={palette()}
				toolbar={<Button palette="primary">+ New</Button>}
				columns={columns}
				queryForm={(api, Field) => {
					const txt = api.createFieldAccessor<string>('txt');
					txt.setValue('abc');
					return (
						<Field label="search">
							<InputText value={txt.getValue()} onChange={v => txt.setValue(v)} />
						</Field>
					);
				}}
				load={pagingLoader}
			/>
		</>
	);
}
