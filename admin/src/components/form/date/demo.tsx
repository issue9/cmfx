// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { boolSelector, Demo, paletteSelector, Stage } from '@/components/base/demo';
import { FieldAccessor } from '@/components/form/field';
import { DatePanel } from './panel';
import { DatePicker } from './picker';
import { Week } from './utils';

export default function() {
    const ac = FieldAccessor('dp', '2024-01-02T15:34', true);
    const min = new Date('2023-12-02T15:34');
    const max = new Date('2025-12-02T15:34');
    const [paletteS, palette] = paletteSelector('primary');
    const [week, setWeek] = createSignal<Week>(0);
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [weekendS, weekend] = boolSelector('weekend');
    const [timeS, time] = boolSelector('time');
    const [minmaxS, minmax] = boolSelector('minmax');
    const [horizontalS, horizontal] = boolSelector('horizontal', true);

    return <Demo settings={
        <>
            {paletteS}
            {timeS}
            {disabledS}
            {readonlyS}
            {weekendS}
            {roundedS}
            {minmaxS}
            {horizontalS}
            <input type="number" min="0" max="6" class="w-40" placeholder='每周起始于' value={week as any} onChange={(e) => setWeek(parseInt(e.target.value) as Week)} />
        </>
    }>
        <Stage title="panel">
            <DatePanel horizontal={horizontal()} label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined} weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} accessor={ac} weekBase={week()} time={time()} />
        </Stage>
        
        <Stage title="picker">
            <DatePicker horizontal={horizontal()} label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined} weekend={weekend()} palette={palette()} tabindex={0} rounded={rounded()} readonly={readonly()} disabled={disabled()} accessor={ac} weekBase={week()} time={time()} />
        </Stage>
    </Demo>;
}
