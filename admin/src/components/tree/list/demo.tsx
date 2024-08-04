// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, Accessor, Setter, For } from 'solid-js';

import { paletteSelector, Demo } from '@/components/base/demo';
import { Item } from '@/components/tree/item';
import { default as List, Props } from './list';

type SelectedClass = Props['selectedClass'];

export function selectedClassSelector(v?: string): [JSX.Element, Accessor<SelectedClass>, Setter<SelectedClass>] {
    const [get, set] = createSignal<SelectedClass>(v);

    const elem = <fieldset class="border-2 flex flex-wrap px-2 py-1">
        <legend>selected class</legend>
        <For each={['selected', '', undefined]}>
            {(item)=>(
                <label class="mr-4">
                    <input class="mr-1" type="radio" name="style"
                        value={item} onClick={()=>set(item as any)}
                        checked={get()===item}
                    />{item ? item : (item === '' ? '<empty>' : '默认值')}
                </label>
            )}
        </For>
    </fieldset>;

    return [elem, get, set];
}

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    const [selectedClsS, selectedCls] = selectedClassSelector('selected');

    const items: Array<Item> = [
        {type: 'item', value: 'v1', label: 'v1'},
        {type: 'item', value: 'v2', label: 'v2'},
        {type: 'item', value: 'v3', label: 'v3'},
        {type: 'divider'},
        {type: 'group', label: 'group', items: [
            {type: 'item', value: 'v22', label: 'v22'},
            {type: 'divider'},
            {type: 'item', value: 'v23', label: 'v23', items:[
                {type: 'item', value: 'v233', label: 'v233'},
                {type: 'item', value: 'v234', label: 'v234', items: [
                    {type: 'item', value: 'v2341', label: 'v2341'},
                    {type: 'divider'},
                    {type: 'item', value: 'v2342', label: 'v2342'},
                    {type: 'item', value: 'v2343', label: 'v2343'},
                ]},
            ]},
        ]},
    ];

    const [selected, setSelected] = createSignal<string>();

    return <Demo settings={
        <>
            {paletteS}
            {selectedClsS}
        </>
    } stages={
        <>
            <div class="w-80 mt-4">
                <List selectedClass={selectedCls()} palette={palette()} onChange={(v,old)=>setSelected(v.toString()+'  '+old?.toString())}>
                    {items}
                </List>
                <div>{ selected() }</div>
            </div>

            <div class="w-80 mt-4">
                <p>不指定 onchange</p>
                <List selectedClass={selectedCls()} palette={palette()}>
                    {items}
                </List>
            </div>
        </>
    } />;
}
