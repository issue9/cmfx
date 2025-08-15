// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Timezone } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { Demo, paletteSelector, Stage } from '../base';

export default function () {
    const [paletteS, palette] = paletteSelector();
    const [timezone, setTimezone] = createSignal();

    return <Demo settings={
        <>
            {paletteS}
        </>
    }>
        <Stage class="w-full h-[600px]">
            <Timezone palette={palette()}
                onChange={d => setTimezone(d)} />
            <span>{timezone()}</span>
        </Stage>
    </Demo>;
}
