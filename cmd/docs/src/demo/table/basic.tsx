// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { BasicTable, Button, Column } from '@cmfx/components';

import { boolSelector, paletteSelector } from '../base';

interface Item {
    id: number;
    name: string;
    address: string;
}

export default function () {
    const [paletteS, palette] = paletteSelector();
    const [loadingS, loading] = boolSelector('loading', false);
    const [fixedLayoutS, fixedLayout] = boolSelector('fixedLayout', false);
    const [nodataS, nodata] = boolSelector('nodata', false);

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
        { id: 'action', renderLabel: 'ACTIONS', renderContent: () => { return <button>...</button>; }, isUnexported: true }
    ];

    return <>
        {paletteS}
        {loadingS}
        {nodataS}
        {fixedLayoutS}

        <BasicTable loading={loading()} fixedLayout={fixedLayout()} palette={palette()}
            items={nodata() ? [] : items} columns={columns}
            extraHeader={<p class="bg-primary-fg text-primary-bg"><Button palette='primary'>Button</Button></p>}
            extraFooter={<p class="bg-primary-fg text-primary-bg">footer</p>}
        />
    </>;
}
