// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Accessor, createSignal, For, JSX, Setter } from 'solid-js';

import { arraySelector, Demo, paletteSelector } from '@admin/components/base/demo';
import { Divider, Props } from './divider';
import { Style, styles } from './types';

export function styleSelector(v: Style = 'solid'): [JSX.Element, Accessor<Style>, Setter<Style>] {
    return arraySelector('风格', styles, v);
}

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [styleS, style] = styleSelector();
    const [pos, setPos] = createSignal<Props['pos']>('start');

    return <Demo settings={
        <>
            {paletteS}
            {styleS}
            <fieldset class="border-2">
                <legend>位置</legend>
                <For each={new Array<Props['pos']>('start', 'center', 'end')}>
                    {(item) => (
                        <label class="mr-4">
                            <input class="mr-1" type="radio" name="type" value={item} onClick={() => setPos(item)} checked={pos() === item} />{item}
                        </label>
                    )}
                </For>
            </fieldset>
        </>
    }>
        <div class="w-56">
            <Divider style={style()} palette={palette()} pos={pos()}><span class="c--icon material-symbols-outlined">face</span>起始位置</Divider>
        </div>

        <div class="w-56">
            <Divider style={style()} palette={palette()} pos={pos()}></Divider>
        </div>
    </Demo>;
}
