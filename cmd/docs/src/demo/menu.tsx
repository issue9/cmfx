// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { ContextMenu, Dropdown, Menu, TreeItem } from '@cmfx/components';
import { Hotkey } from '@cmfx/core';
import { createSignal } from 'solid-js';
import IconFace from '~icons/material-symbols/face';

import { arraySelector, Demo, paletteSelector, Stage } from './base';

function selectedClassSelector(preset?: string) {
    return arraySelector('selected class', ['selected', '', undefined], preset);
}

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    const [selectedClsS, selectedCls] = selectedClassSelector(undefined);
    const [layoutS, layout] = arraySelector('layout', ['horizontal', 'vertical', 'inline'], 'inline');

    const items1: Array<TreeItem> = [
        { type: 'item', value: 'v1', label: 'v1', icon: IconFace, disabled: true },
        { type: 'item', value: 'v2', label: 'v2' },
        { type: 'divider' },
        {
            type: 'group', label: 'group', items: [
                { type: 'item', value: 'v22', label: 'v22' },
                { type: 'divider' },
                {
                    type: 'item', value: 'v23', label: 'v23', items: [
                        { type: 'item', value: 'v233', label: 'v233' },
                        {
                            type: 'item', value: 'v234', label: 'v234', items: [
                                { type: 'item', value: 'v2341', label: 'v2341' },
                                { type: 'item', value: 'v2342', label: 'v2342' },
                                { type: 'divider' },
                                { type: 'item', value: 'v2343', label: 'v2343' },
                            ]
                        },
                    ]
                },
            ]
        },
        { type: 'item', value: 'v3', label: 'v3(control+a)', hotkey: new Hotkey('a', 'control') },
        {
            type: 'item', value: 'v4', label: '很长很长很长的标题-v4', icon: IconFace, items: [
                { type: 'item', value: 41, label: 'v41' },
                { type: 'divider' },
                {
                    type: 'item', value: 42, label: 'v42', icon: IconFace, items: [
                        { type: 'item', value: 'v421', label: '很长很长很长的标题-v421' },
                        { type: 'item', value: 'v422', label: 'v422' },
                        { type: 'divider' },
                        { type: 'item', value: 'v423', label: 'v423' },
                    ]
                },
            ]
        },
    ];

    const items2: Array<TreeItem> = [
        { type: 'item', value: 'v1', label: 'v1', icon: IconFace, disabled: true },
        { type: 'item', value: 'v2', label: 'v2' },
        { type: 'divider' },
        {
            type: 'group', label: 'group', items: [
                { type: 'item', value: 'v22', label: 'v22' },
                { type: 'divider' },
                {
                    type: 'item', value: 'v23', label: 'v23', items: [
                        { type: 'item', value: 'v233', label: 'v233' },
                        {
                            type: 'item', value: 'v234', label: 'v234', items: [
                                { type: 'item', value: 'v2341', label: 'v2341' },
                                { type: 'item', value: 'v2342', label: 'v2342' },
                                { type: 'divider' },
                                { type: 'item', value: 'v2343', label: 'v2343' },
                            ]
                        },
                    ]
                },
            ]
        },
        { type: 'item', value: 'v3', label: 'v3(control+b)', hotkey: new Hotkey('b', 'control') },
        {
            type: 'item', value: 'v4', label: '很长很长很长的标题-v4', icon: IconFace, items: [
                { type: 'item', value: 41, label: 'v41' },
                { type: 'divider' },
                {
                    type: 'item', value: 42, label: 'v42', icon: IconFace, items: [
                        { type: 'item', value: 'v421', label: '很长很长很长的标题-v421' },
                        { type: 'item', value: 'v422', label: 'v422' },
                        { type: 'divider' },
                        { type: 'item', value: 'v423', label: 'v423' },
                    ]
                },
            ]
        },
    ];

    const items3: Array<TreeItem> = [
        { type: 'item', value: 'v1', label: 'v1', icon: IconFace, disabled: true },
        { type: 'item', value: 'v2', label: 'v2' },
        { type: 'divider' },
        {
            type: 'group', label: 'group', items: [
                { type: 'item', value: 'v22', label: 'v22' },
                { type: 'divider' },
                {
                    type: 'item', value: 'v23', label: 'v23', items: [
                        { type: 'item', value: 'v233', label: 'v233' },
                        {
                            type: 'item', value: 'v234', label: 'v234', items: [
                                { type: 'item', value: 'v2341', label: 'v2341' },
                                { type: 'item', value: 'v2342', label: 'v2342' },
                                { type: 'divider' },
                                { type: 'item', value: 'v2343', label: 'v2343' },
                            ]
                        },
                    ]
                },
            ]
        },
        { type: 'item', value: 'v3', label: 'v3(control+c)' },
        {
            type: 'item', value: 'v4', label: '很长很长很长的标题-v4', icon: IconFace, items: [
                { type: 'item', value: 41, label: 'v41' },
                { type: 'divider' },
                {
                    type: 'item', value: 42, label: 'v42', icon: IconFace, items: [
                        { type: 'item', value: 'v421', label: '很长很长很长的标题-v421' },
                        { type: 'item', value: 'v422', label: 'v422' },
                        { type: 'divider' },
                        { type: 'item', value: 'v423', label: 'v423' },
                    ]
                },
            ]
        },
    ];

    const [selected, setSelected] = createSignal<string>();

    let contextTarget: HTMLElement | null;

    return <Demo settings={
        <>
            {paletteS}
            {selectedClsS}
            {layoutS}
        </>
    }>
        <Stage class="mt-4 min-w-120">
            <Menu layout={layout()} selectedClass={selectedCls()} palette={palette()} items={items1}
                onChange={(val, old) => {
                    setSelected(`new:${val}, old:${old}`);
                }}
            />
            <p>{selected()}</p>
        </Stage>

        <Stage class="mt-4 min-w-120" title='多选'>
            <Menu layout={layout()} selectedClass={selectedCls()} palette={palette()} multiple items={items2} />
        </Stage>


        <Stage class="mt-4 min-w-120" title='anchor'>
            <Menu layout={layout()} selectedClass={selectedCls()} palette={palette()} anchor items={items3} />
        </Stage>


        <Stage class="mt-4 min-w-120" title='dropdown'>
            <Dropdown selectedClass={selectedCls()} palette={palette()} items={items3} hoverable>dropdown</Dropdown>
        </Stage>

        <Stage class="mt-4 min-w-120" title='dropdown multiple'>
            <Dropdown selectedClass={selectedCls()} palette={palette()} items={items3} multiple>dropdown</Dropdown>
        </Stage>

        <Stage class="mt-4 min-w-120" title='context menu'>
            <div class="bg-primary-bg text-primary-fg w-10 h-10" ref={el => contextTarget = el}>right click</div>
            <ContextMenu selectedClass={selectedCls()} palette={palette()} items={items3} multiple target={contextTarget} />
        </Stage>
    </Demo>;
}
