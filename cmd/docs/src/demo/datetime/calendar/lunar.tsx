// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Calendar, datetimePluginLunar, notify, Week } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { boolSelector, paletteSelector } from '../../base';

export default function () {
    const now = new Date();
    const min = new Date(now.getFullYear(), now.getMonth()-2, now.getDate());
    const max = new Date(now.getFullYear(), now.getMonth()+2, now.getDate());;

    const [paletteS, palette] = paletteSelector();
    const [week, setWeek] = createSignal<Week>(0);
    const [weekendS, weekend] = boolSelector('weekend');
    const [minmaxS, minmax] = boolSelector('minmax');

    return <div>
        {paletteS}
        {weekendS}
        {minmaxS}
        <input type="number" min="0" max="6" class="w-40" placeholder='每周起始于' value={week as any} onChange={(e) => setWeek(parseInt(e.target.value) as Week)} />

        <div class="w-full h-[600px]">
            <Calendar weekend={weekend()} weekBase={week()} palette={palette()}
                plugins={[datetimePluginLunar]}
                min={minmax() ? min : undefined} max={minmax() ? max : undefined}
                onSelected={(d: Date) => notify(d.toString())} />
        </div>
    </div>;
}
