// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ContextMenu, Item, Menu, MenuPanel } from '@cmfx/components';
import { Hotkey } from '@cmfx/core';
import { createSignal } from 'solid-js';

import { boolSelector, Demo, paletteSelector, Stage } from '../base';
import { selectedClassSelector } from './list';

export default function() {
    const [paletteS,palette] = paletteSelector('primary');
    const [selectedClsS, selectedCls] = selectedClassSelector('selected');
    const [rightS, right] = boolSelector('right');

    const items: Array<Item> = [
        {type: 'item', value: 'v1', label: 'v1'},
        {type: 'item', value: 'v2', label: 'v2'},
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

    const items2: Array<Item> = [
        ...items,
        { type: 'item', value: 'v3', label: 'v3(control+a)', hotkey: new Hotkey('a', 'control') },
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
                <MenuPanel direction={right() ? 'right' : 'left'} selectedClass={selectedCls()} palette={palette()} onChange={(v, old) => { setSelected(v?.toString() + '  ' + old?.toString()); return true; }}>
                    {items}
                </MenuPanel>
            </div>
            <div>{selected()}</div>
        </Stage>

        <Stage class="w-80 mt-4">
            <Menu direction={right() ? 'right' : 'left'} selectedClass={selectedCls()} palette={palette()} activator={<Button>click</Button>}>
                {items2}
            </Menu>
        </Stage>

        <Stage class="w-80 mt-4">
            <Menu hoverable direction={right() ? 'right' : 'left'} selectedClass={selectedCls()} palette={palette()} activator={<Button>hover</Button>}>
                {items}
            </Menu>
        </Stage>

        <Stage class="w-80 mt-4">
            <ContextMenu direction={right() ? 'right' : 'left'} selectedClass={selectedCls()} palette={palette()} activator={<div class="bg-palette-bg border border-palette-fg-low">context menu</div>}>
                {items}
            </ContextMenu>
        </Stage>
    </Demo>;
}
