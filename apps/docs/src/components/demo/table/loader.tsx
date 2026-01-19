// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Column, LoaderTable, MountProps } from '@cmfx/components';
import { sleep } from '@cmfx/core';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

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

const nopagingLoader = async (_: {}): Promise<Array<Item>> => {
    await sleep(500);
    return [...buildItems(1, 10)];
};

export default function (props: MountProps): JSX.Element {
    const [SystemToolbar, systemToolbar] = boolSelector('systemToolbar', true);
    const [Palette, palette] = paletteSelector();
    const [FixedLayout, fixedLayout] = boolSelector('fixedLayout', false);

    const columns: Array<Column<Item>> = [
        { id: 'id' },
        { id: 'name' },
        { id: 'address' },
        { id: 'action', renderLabel: 'ACTIONS', renderContent: () => { return <button>...</button>; }, isUnexported: true, cellClass:'no-print' }
    ];

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <FixedLayout />
            <SystemToolbar />
        </Portal>

        <LoaderTable systemToolbar={systemToolbar()}
            fixedLayout={fixedLayout()}
            palette={palette()}
            columns={columns}
            queries={{}}
            load={nopagingLoader}
        />
    </>;
}
