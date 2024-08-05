// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { boolSelector, Demo, paletteSelector } from '@/components/base/demo';
import Table from './table';
import { Column } from './types';

export default function () {
    const [paletteS, palette] = paletteSelector();
    const [hoverableS, hoverable] = boolSelector('hoverable', false);
    const [fixedLayoutS, fixedLayout] = boolSelector('fixedLayout', false);
    const [striped, setStriped] = createSignal<number>(0);

    const items = [
        {id: 1, name: 'name1', address: 'address1'},
        {id: 2, name: 'name2', address: 'address2'},
        {id: 3, name: 'name3', address: 'address3 这是一行很长的数据，如果 fixedLayout 为 true，那么此行将会换行。'},
        {id: 4, name: 'name4', address: 'address4'},
        {id: 5, name: 'name5', address: 'address5'},
        {id: 6, name: 'name6', address: 'address6'},
    ];

    const header: Array<Column<typeof items[0]>> = [
        {id: 'id'},
        {id: 'name'},
        {id: 'address'},
        { id: 'action', label: 'ACTIONS', render: () => { return <button>...</button>; }}
    ];

    return <Demo settings={
        <>
            {paletteS}
            {fixedLayoutS}
            {hoverableS}
            <input type='number' placeholder='striped' value={striped()} onChange={(e)=>setStriped(parseInt(e.target.value))} />
        </>
    } stages={
        <>
            <Table striped={striped()} fixedLayout={fixedLayout()}  palette={palette()} items={items} header={header} hoverable={hoverable()} />
        </>
    } />;
}
