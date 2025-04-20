// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Page, Query, sleep } from '@cmfx/core';

import { boolSelector, Demo, paletteSelector, Stage } from '@components/base/demo';
import { Button } from '@components/button';
import { TextField } from '@components/form';
import { BasicTable } from './basic';
import { Column } from './column';
import { LoaderTable } from './loader';

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

const nopagingLoader = async (_: {}): Promise<Array<Item>> => {
    await sleep(500);
    return [...buildItems(1, 10)];
};

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

export default function () {
    const [paletteS, palette] = paletteSelector();
    const [loadingS, loading] = boolSelector('loading', false);
    const [fixedLayoutS, fixedLayout] = boolSelector('fixedLayout', false);
    const [nodataS, nodata] = boolSelector('nodata', false);
    const [systemToolbarS, systemToolbar] = boolSelector('systemToolbar', true);

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

    return <Demo settings={
        <>
            {paletteS}
            {loadingS}
            {nodataS}
            {fixedLayoutS}
            {systemToolbarS}
        </>
    }>
        <Stage class="w-full">
            <BasicTable loading={loading()} fixedLayout={fixedLayout()} palette={palette()}
                items={nodata() ? [] : items} columns={columns}
                extraHeader={<p class="bg-primary-fg text-primary-bg"><Button palette='primary'>Button</Button></p>}
                extraFooter={<p class="bg-primary-fg text-primary-bg">footer</p>}
            />
        </Stage>


        <Stage title="分页表格" class="w-full">
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
        </Stage>

        <Stage title="未分页的表格" class="w-full">
            <LoaderTable systemToolbar={systemToolbar()}
                fixedLayout={fixedLayout()}
                palette={palette()}
                columns={columns}
                queries={{}}
                load={nopagingLoader}
            />
        </Stage>
    </Demo>;
}
