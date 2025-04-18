// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { boolSelector, Demo, paletteSelector, Stage } from '@admin/components/base/demo';
import { Button } from '@admin/components/button';
import { Item } from '@admin/components/tree/item';
import { selectedClassSelector } from '@admin/components/tree/list/demo';
import { ContextMenu } from './context';
import { Menu } from './menu';
import { default as Panel } from './panel';

export default function() {
    const [paletteS,palette] = paletteSelector('primary');
    const [selectedClsS, selectedCls] = selectedClassSelector('selected');
    const [rightS, right] = boolSelector('right');

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
            {rightS}
        </>
    }>
        <Stage class="w-80 mt-4">
            <div class="absolute">
                <Panel direction={right() ? 'right' : 'left'} selectedClass={selectedCls()} palette={palette()} onChange={(v, old) => { setSelected(v?.toString() + '  ' + old?.toString()); return true; }}>
                    {items}
                </Panel>
            </div>
            <div>{selected()}</div>
        </Stage>


        <Stage class="w-80 mt-4">
            <Menu direction={right() ? 'right' : 'left'} selectedClass={selectedCls()} palette={palette()} activator={<Button>click</Button>}>
                {items}
            </Menu>
        </Stage>

        <Stage class="w-80 mt-4">
            <Menu hoverable direction={right() ? 'right' : 'left'} selectedClass={selectedCls()} palette={palette()} activator={<Button>hover</Button>}>
                {items}
            </Menu>
        </Stage>

        <Stage class="w-80 mt-4">
            <ContextMenu selectedClass={selectedCls()} palette={palette()} activator={<div class="bg-palette-bg border border-palette-fg-low">context menu</div>}>
                {items}
            </ContextMenu>
        </Stage>
    </Demo>;
}
