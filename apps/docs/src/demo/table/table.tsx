// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Table, MountProps, TableProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import { For } from 'solid-js';

import { createSignal } from 'solid-js';
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
    const [striped, setStriped] = createSignal<TableProps['striped']>(0);

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {fixedLayoutS}
            {hoverableS}
            <input type="number" min={0} max={10} value={striped()} onInput={e => setStriped(parseInt(e.currentTarget.value))} />
        </Portal>

        <Table striped={striped()} palette={palette()} fixedLayout={fixedLayout()} hoverable={hoverable()}>
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
