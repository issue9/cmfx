// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Accessor, createSignal, For, JSX, Setter } from 'solid-js';

import { paletteSelector } from '@/components/base/demo';
import Table from './table';
import { Column, striped as ss, Striped } from './types';

export function stripedSelector(v?: Striped): [JSX.Element, Accessor<Striped|undefined>, Setter<Striped|undefined>] {
    const [get, set] = createSignal<Striped|undefined>(v);

    const elem = <fieldset class="border-2 flex flex-wrap px-2 py-1">
        <legend>条纹</legend>
        <For each={[...ss,undefined]}>
            {(item)=>(
                <label class="mr-4">
                    <input class="mr-1" type="radio" name="palette"
                        value={item} onClick={()=>set(item as any)}
                        checked={get()===item}
                    />{item ? item : 'undefined'}
                </label>
            )}
        </For>
    </fieldset>;

    return [elem, get, set];
}

export default function () {
    const [paletteS, palette] = paletteSelector();
    const [stripedS, striped] = stripedSelector();
    const [fixedLayout, setFixedLayout] = createSignal(false);

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
        { id: 'action', label: 'ACTIONS', render: (id) => { return <button>...</button>; }}
    ];

    return <div class="p-5 flex flex-col items-center gap-5">
        <div class="flex justify-around gap-2">
            {paletteS}
            {stripedS}

            <label><input type="checkbox" checked={fixedLayout()} onChange={()=>setFixedLayout(!fixedLayout())} />fixedLayout</label>
        </div>

        <Table striped={striped()} fixedLayout={fixedLayout()}  palette={palette()} items={items} header={header} />
    </div>;
}
