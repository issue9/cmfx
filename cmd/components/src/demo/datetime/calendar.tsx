// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Calendar, datetimePluginLunar, notify, Week } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { Demo, paletteSelector, Stage } from '../base';

export default function () {
    const [paletteS, palette] = paletteSelector();
    const [week, setWeek] = createSignal<Week>(0);

    return <Demo settings={
        <>
            {paletteS}
            <input type="number" min="0" max="6" class="w-40" placeholder='每周起始于' value={week as any} onChange={(e) => setWeek(parseInt(e.target.value) as Week)} />
        </>
    }>
        <Stage class="w-full h-[600px]">
            <Calendar weekBase={week()} palette={palette()} plugins={[datetimePluginLunar]} onSelected={(d: Date) => notify(d.toString())} />
        </Stage>
    </Demo>;
}
