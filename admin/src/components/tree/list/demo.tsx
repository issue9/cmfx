// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Accessor, createSignal, For, JSX, Setter } from 'solid-js';

import { Demo, paletteSelector, Stage } from '@/components/base/demo';
import { Item } from '@/components/tree/item';
import { List, Props } from './list';

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
    }>
        <Stage class="w-80 mt-4">
            <List selectedClass={selectedCls()} palette={palette()} onChange={(v, old) => setSelected(v.toString() + '  ' + old?.toString())}>
                {items}
            </List>
            <div>{selected()}</div>
        </Stage>

        <Stage class="w-80 mt-4" title="不指定 onchange，但是有默认值">
            <List selectedClass={selectedCls()} palette={palette()} selected='v2341'>
                {items}
            </List>
        </Stage>

        <Stage class="w-80 mt-4" title="anchor=true">
            <List anchor selectedClass={selectedCls()} palette={palette()}>
                {items}
            </List>
        </Stage>
    </Demo>;
}
