// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, DateRangePanel, DateRangeValueType, datetimePluginLunar, Week } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { boolSelector, paletteSelector } from '../../base';

export default function() {
    const now = new Date();
    const min = new Date(now.getFullYear(), now.getMonth()-2, now.getDate());
    const max = new Date(now.getFullYear(), now.getMonth()+2, now.getDate());;

    const [paletteS, palette] = paletteSelector('primary');
    const [week, setWeek] = createSignal<Week>(0);
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [weekendS, weekend] = boolSelector('weekend');
    const [weeksS, weeks] = boolSelector('weeks');
    const [minmaxS, minmax] = boolSelector('minmax');
    const [shortcutS, shortcut] = boolSelector('shortcuts(range)');


    const [range, setRange] = createSignal<DateRangeValueType>();

    return <div>
        {paletteS}
        {disabledS}
        {readonlyS}
        {weekendS}
        {minmaxS}
        {weeksS}
        {shortcutS}
        <input type="number" min="0" max="6" class="w-40" placeholder='每周起始于' value={week as any} onChange={(e) => setWeek(parseInt(e.target.value) as Week)} />
        <Button onclick={() => {
            setRange();
        }}>set undefined</Button>
        <Button onclick={() => {
            const now = new Date();
            const next = new Date(now);
            next.setMonth(next.getMonth() + 1);
            setRange([now, next]);
        }}>now</Button>

        <div title="range panel" class="flex items-start">
            <DateRangePanel min={minmax() ? min : undefined} max={minmax() ? max : undefined} shortcuts={shortcut()} weeks={weeks()}
                weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} weekBase={week()}
                plugins={[datetimePluginLunar]} value={range()}
                onChange={(val) => {
                    setRange(val);
                }} />
        </div>

        <div title="range panel with time" class="flex items-start">
            <DateRangePanel min={minmax() ? min : undefined} max={minmax() ? max : undefined} shortcuts={shortcut()} weeks={weeks()}
                weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} weekBase={week()}
                time value={range()}
                onChange={(val) => {
                    setRange(val);
                }} />
        </div>
    </div>;
}
