// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { boolSelector, Demo, paletteSelector } from '@/components/base/demo';
import { ObjectAccessor } from '@/components/form';
import { Page, sleep } from '@/core';
import { default as BasicTable } from './basic';
import { default as DataTable, fromSearch } from './datatable';
import { Column } from './types';

interface Item {
    id: number;
    name: string;
    address: string;
}

interface Query {
    txt: string;
}

type PagingQuery = Query & {
    page: number;
    size: number;
};

function buildItems(start: number, size: number): Array<Item> {
    const items: Array<Item> = [];
    for (var i = start; i < start+size; i++) {
        items.push({ id: i, name: `name ${i}`, address: `address ${i}` });
    }

    return items;
}

const nopagingLoader = async (_: ObjectAccessor<Query>): Promise<Array<Item>> => {
    await sleep(500);
    return [...buildItems(1, 10)];
};

const pagingLoader = async (oa: ObjectAccessor<PagingQuery>): Promise<Page<Item>> => {
    const count = 100;
    await sleep(500);

    const page = oa.accessor<number>('page').getValue();
    const size = oa.accessor<number>('size').getValue();

    return {
        more: page * size < count,
        count: count,
        current: [...buildItems((page-1) * size, size)]
    };
};

export default function () {
    const [paletteS, palette] = paletteSelector();
    const [hoverableS, hoverable] = boolSelector('hoverable', false);
    const [fixedLayoutS, fixedLayout] = boolSelector('fixedLayout', false);
    const [striped, setStriped] = createSignal<number>(0);

    const items: Array<Item> = [
        { id: 1, name: 'name1', address: 'address1' },
        { id: 2, name: 'name2', address: 'address2' },
        { id: 3, name: 'name3', address: 'address3 这是一行很长的数据，如果 fixedLayout 为 true，那么此行将会换行。' },
        { id: 4, name: 'name4', address: 'address4' },
        { id: 5, name: 'name5', address: 'address5' },
        { id: 6, name: 'name6', address: 'address6' },
    ];

    const header: Array<Column<Item>> = [
        { id: 'id' },
        { id: 'name' },
        { id: 'address' },
        { id: 'action', label: 'ACTIONS', render: () => { return <button>...</button>; } }
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
            <BasicTable striped={striped()} fixedLayout={fixedLayout()}  palette={palette()}
                items={items} columns={header} hoverable={hoverable()}
                extraHeader={<p class="bg-primary-fg text-primary-bg">header</p>}
                extraFooter={<p class="bg-primary-fg text-primary-bg">footer</p>}
            />

            <p>分页表格</p>

            <DataTable paginationPalette='primary' paging striped={striped()} fixedLayout={fixedLayout()}  palette={palette()}
                columns={header} hoverable={hoverable()}
                queries={fromSearch({txt: 'abc', page: 1, size: 10})}
                queryForm={(oa)=><></>}
                load={pagingLoader}
            />

            <p>未分页的表格</p>

            <DataTable striped={striped()} fixedLayout={fixedLayout()}  palette={palette()}
                columns={header} hoverable={hoverable()}
                queries={{txt: 'abc'}}
                queryForm={(oa)=><></>}
                load={nopagingLoader}
            />
        </>
    } />;
}
