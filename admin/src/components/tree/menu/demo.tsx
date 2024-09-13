// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { Demo, paletteSelector } from '@/components/base/demo';
import { Button } from '@/components/button';
import { Item } from '@/components/tree/item';
import { selectedClassSelector } from '@/components/tree/list/demo';
import { default as Menu } from './menu';
import { default as Panel } from './panel';

export default function() {
    const [paletteS,palette] = paletteSelector('primary');
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
                    {type: 'item', value: 'v2342', label: 'v2342'},
                    {type: 'divider'},
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
        <div class="w-80 mt-4">
            <p>panel</p>
            <Panel selectedClass={selectedCls()} palette={palette()} onChange={(v, old) => { setSelected(v.toString() + '  ' + old?.toString()); return true; }}>
                {items}
            </Panel>
            <div>{ selected() }</div>

            <Menu selectedClass={selectedCls()} palette={palette()} activator={<Button palette='primary'>menu</Button>}>
                {items}
            </Menu>
        </div>
    } />;
}
