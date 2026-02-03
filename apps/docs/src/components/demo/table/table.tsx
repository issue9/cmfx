// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, MountProps, Number, Table, TableProps } from '@cmfx/components';
import { For } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

interface Item {
	id: number;
	name: string;
	address: string;
}

function buildItems(start: number, size: number): Array<Item> {
	const items: Array<Item> = [];
	for (let i = start; i < start + size; i++) {
		items.push({ id: i, name: `name ${i}`, address: `address ${i}` });
	}

	return items;
}

export default function (props: MountProps) {
	const striped = fieldAccessor<TableProps['striped']>('striped', 0);
	const [Palette, palette] = paletteSelector();
	const [FixedLayout, fixedLayout] = boolSelector('fixedLayout', false);
	const [Hoverable, hoverable] = boolSelector('hoverable', false);

	return (
		<>
			<Portal mount={props.mount}>
				<Palette />
				<FixedLayout />
				<Hoverable />
				<Number class="w-20" accessor={striped} min={0} max={10} />
			</Portal>

			<Table striped={striped.getValue()} palette={palette()} fixedLayout={fixedLayout()} hoverable={hoverable()}>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Address</th>
					</tr>
				</thead>
				<tbody>
					<For each={buildItems(0, 10)}>
						{item => (
							<tr>
								<td>{item.id}</td>
								<td>{item.name}</td>
								<td>{item.address}</td>
							</tr>
						)}
					</For>
				</tbody>
			</Table>
		</>
	);
}
