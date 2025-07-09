// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { DatePicker, DateRangePanel, DateRangePicker, fieldAccessor, Week } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { boolSelector, Demo, layoutSelector, paletteSelector, Stage } from '../base';

export default function() {
    const ac = fieldAccessor('dp', '2024-01-02T15:34', true);
    const range = fieldAccessor<[string, string]>('range', ['2024-01-02T15:34', '2025-01-02T15:34'], true);

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
    const [actionsS, actions] = boolSelector('actions');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');

    return <Demo settings={
        <>
            {paletteS}
            {timeS}
            {disabledS}
            {readonlyS}
            {weekendS}
            {roundedS}
            {minmaxS}
            {layoutS}
            {actionsS}
            <input type="number" min="0" max="6" class="w-40" placeholder='每周起始于' value={week as any} onChange={(e) => setWeek(parseInt(e.target.value) as Week)} />
        </>
    }>
        <Stage title="picker">
            <DatePicker actions={actions()} class="w-[400px]" placeholder='placeholder' layout={layout()} label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined} weekend={weekend()} palette={palette()} tabindex={0} rounded={rounded()} readonly={readonly()} disabled={disabled()} accessor={ac} weekBase={week()} time={time()} />
        </Stage>

        <Stage title="min-width">
            <DatePicker actions={actions()} class="w-[200px]" placeholder='placeholder' layout={layout()} label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined} weekend={weekend()} palette={palette()} tabindex={0} rounded={rounded()} readonly={readonly()} disabled={disabled()} accessor={ac} weekBase={week()} time={time()} />
        </Stage>

        <Stage title="range panel">
            <DateRangePanel min={minmax() ? min : undefined} max={minmax() ? max : undefined} weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} accessor={ac} weekBase={week()} time={time()} />
            <p>{range.getValue()}</p>
        </Stage>

        <Stage title="range">
            <DateRangePicker class="w-[500px]" placeholder='placeholder' layout={layout()} label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined} weekend={weekend()} palette={palette()} tabindex={0} rounded={rounded()} readonly={readonly()} disabled={disabled()} accessor={range} weekBase={week()} time={time()} />
        </Stage>
    </Demo>;
}
