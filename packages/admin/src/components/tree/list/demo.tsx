// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { arraySelector, Demo, paletteSelector, Stage } from '@admin/components/base/demo';
import { Item } from '@admin/components/tree/item';
import { List } from './list';

export function selectedClassSelector(v?: string) {
    return arraySelector('selected class', ['selected', '', undefined], v);
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
    const [old, setOld] = createSignal<string>();

    return <Demo settings={
        <>
            {paletteS}
            {selectedClsS}
        </>
    }>
        <Stage class="w-80 mt-4">
            <List selectedClass={selectedCls()} palette={palette()} onChange={(v, old) => {
                setSelected(v as string);
                setOld(old as string);
            }}>
                {items}
            </List>
            <div>selected: {selected()}, old: {old()}</div>
        </Stage>

        <Stage class="w-80 mt-4" title="不指定 onchange，但是有默认值">
            <List selectedClass={selectedCls()} palette={palette()} selected={selected()}>
                {items}
            </List>
        </Stage>

        <Stage class="w-80 mt-4" title="anchor=true">
            <List anchor selectedClass={selectedCls()} palette={palette()} selected={selected()}>
                {items}
            </List>
        </Stage>
    </Demo>;
}
