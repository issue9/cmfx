// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Table, fieldAccessor, MountProps, TableProps, Number } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import { For } from 'solid-js';

import { boolSelector, paletteSelector } from '../base';

interface Item {
    id: number;
    name: string;
    address: string;
}

function buildItems(start: number, size: number): Array<Item> {
    const items: Array<Item> = [];
    for (var i = start; i < start+size; i++) {
        items.push({ id: i, name: `name ${i}`, address: `address ${i}` });
    }

    return items;
}

export default function (props: MountProps) {
    const [paletteS, palette] = paletteSelector();
    const [fixedLayoutS, fixedLayout] = boolSelector('fixedLayout', false);
    const [hoverableS, hoverable] = boolSelector('hoverable', false);
    const striped = fieldAccessor<TableProps['striped']>('striped', 0);

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {fixedLayoutS}
            {hoverableS}
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
                <For each={buildItems(0, 10)}>{item => (
                    <tr>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.address}</td>
                    </tr>
                )}</For>
            </tbody>
        </Table>
    </>;
}
