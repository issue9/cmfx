// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Divider, DividerProps } from '@cmfx/components';
import { createSignal, For } from 'solid-js';

import { Demo, paletteSelector, boolSelector } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [verticalS, vertical] = boolSelector('vertical');
    const [pos, setPos] = createSignal<DividerProps['pos']>('start');

    return <Demo settings={
        <>
            {paletteS}
            {verticalS}
            <fieldset class="border-2">
                <legend>位置</legend>
                <For each={new Array<DividerProps['pos']>('start', 'center', 'end')}>
                    {(item) => (
                        <label class="mr-4">
                            <input class="mr-1" type="radio" name="type" value={item} onClick={() => setPos(item)} checked={pos() === item} />{item}
                        </label>
                    )}
                </For>
            </fieldset>
        </>
    }>
        <div class="w-56 h-56">
            <Divider vertical={vertical()} palette={palette()} pos={pos()}><span class="c--icon material-symbols-outlined">face</span>起始位置</Divider>
        </div>

        <div class="w-56 h-56">
            <Divider vertical={vertical()} palette={palette()} pos={pos()}></Divider>
        </div>
    </Demo>;
}
