// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Column, LoaderTable, MountProps, TextField } from '@cmfx/components';
import { Page, Query, sleep } from '@cmfx/core';
import { JSX } from 'solid-js';
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
    for (var i = start; i < start+size; i++) {
        items.push({ id: i, name: `name ${i}`, address: `address ${i}` });
    }

    return items;
}

const pagingLoader = async (oa: Q): Promise<Page<Item>> => {
    const count = 100;
    await sleep(500);

    if (!oa.size) { // 下载没有 size
        return {
            more: false,
            count: 100,
            current: [...buildItems(0, count)]
        };
    }

    const page = oa.page! as number;
    const size = oa.size! as number;

    return {
        more: page * size < count,
        count: count,
        current: [...buildItems((page-1) * size, size)]
    };
};

export default function (props: MountProps): JSX.Element {
    const [Palette, palette] = paletteSelector();
    const [FixedLayout, fixedLayout] = boolSelector('fixedLayout', false);
    const [SystemToolbar, systemToolbar] = boolSelector('systemToolbar', true);

    const columns: Array<Column<Item>> = [
        { id: 'id' },
        { id: 'name' },
        { id: 'address' },
        { id: 'action', renderLabel: 'ACTIONS', renderContent: () => { return <button>...</button>; }, isUnexported: true }
    ];

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <FixedLayout />
            <SystemToolbar />
        </Portal>

        <LoaderTable accentPalette='primary' paging systemToolbar={systemToolbar()}
            inSearch
            fixedLayout={fixedLayout()}
            palette={palette()}
            toolbar={<><Button palette='primary'>+ New</Button></>}
            columns={columns}
            queries={{ txt: 'abc', page: 1, size: 10 }}
            queryForm={(oa) => <><TextField accessor={oa.accessor<string>('txt')} /></>}
            load={pagingLoader}
        />
    </>;
}
