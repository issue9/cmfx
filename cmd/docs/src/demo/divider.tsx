// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Divider, DividerProps } from '@cmfx/components';
import { createSignal, For } from 'solid-js';
import IconFace from '~icons/material-symbols/face';

import { Demo, layoutSelector, paletteSelector } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [layoutS, layout] = layoutSelector('布局', 'vertical');
    const [pos, setPos] = createSignal<DividerProps['pos']>('start');

    return <Demo settings={
        <>
            {paletteS}
            {layoutS}
            <fieldset class="border-2">
                <legend>位置</legend>
                <For each={new Array<DividerProps['pos']>('start', 'center', 'end')}>
                    {(item) => (
                        <label class="me-4">
                            <input class="me-1" type="radio" name="type" value={item} onClick={() => setPos(item)} checked={pos() === item} />{item}
                        </label>
                    )}
                </For>
            </fieldset>
        </>
    }>
        <div class="w-56 h-56">
            <Divider layout={layout()} palette={palette()} pos={pos()}>
                <IconFace />起始位置
            </Divider>
        </div>

        <div class="w-56 h-56">
            <Divider layout={layout()} palette={palette()} pos={pos()}>
                <IconFace />english
            </Divider>
        </div>

        <div class="w-56 h-56">
            <Divider layout={layout()} palette={palette()} pos={pos()}>
                <span style={{'writing-mode': 'vertical-rl', 'text-orientation': 'upright'}}>起始位置<span>111</span></span>
            </Divider>
        </div>

        <div class="w-56 h-56">
            <Divider layout={layout()} palette={palette()} pos={pos()}>
                <span style={{'writing-mode': 'vertical-rl', 'text-orientation': 'upright', 'display': 'flex', 'align-items': 'center'}}>
                    english<IconFace />
                </span>
            </Divider>
        </div>

        <div class="w-56 h-56">
            <Divider layout={layout()} palette={palette()} pos={pos()}></Divider>
        </div>
    </Demo>;
}
