// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { paletteSelector } from '@/components/base/demo';
import { Item } from '@/components/tree/item';
import { default as Menu } from './menu';

export default function() {
    const [paletteS,palette] = paletteSelector('primary');
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
    return <div class="flex flex-col gap-2">
        {paletteS}

        <div class="w-80 mt-4">
            <Menu palette={palette()} onChange={(v,old)=>setSelected(v.toString()+'  '+old?.toString())}>
                {items}
            </Menu>
            <div>{ selected() }</div>
        </div>
    </div>;
}
