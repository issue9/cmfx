// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, DatePanel, DateRangePanel, DateRangeValueType, datetimePluginLunar, Week } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { boolSelector, Demo, paletteSelector, Stage } from '../base';

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
    const [timeS, time] = boolSelector('time');
    const [shortcutS, shortcut] = boolSelector('shortcuts(range)');

    const [val, setValue] = createSignal<Date | undefined>(undefined);
    const [valWithTime, setValWithTime] = createSignal<Date | undefined>(undefined);
    const [valShow, setValShow] = createSignal<string>('');
    const [valWithTimeShow, setValWithTimeShow] = createSignal<string>('');

    const [range, setRange] = createSignal<DateRangeValueType>();

    return <Demo settings={
        <>
            {paletteS}
            {disabledS}
            {readonlyS}
            {weekendS}
            {minmaxS}
            {timeS}
            {weeksS}
            {shortcutS}
            <input type="number" min="0" max="6" class="w-40" placeholder='每周起始于' value={week as any} onChange={(e) => setWeek(parseInt(e.target.value) as Week)} />
            <Button onClick={() => {
                setValue();
                setValWithTime();
                setRange();
            }}>set undefined</Button>
            <Button onClick={() => {
                const now = new Date();
                const next = new Date(now);
                next.setMonth(next.getMonth() + 1);
                setValue(now);
                setValWithTime(now);
                setRange([now, next]);
            }}>now</Button>
        </>
    }>
        <Stage title="panel" class="flex items-start">
            <DatePanel time={time()} min={minmax() ? min : undefined} max={minmax() ? max : undefined} weeks={weeks()}
                weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} value={val()} weekBase={week()}
                onChange={(val, old) => {
                    setValShow(`new:${val}old:${old}`);
                    setValue(val);
                }} />
            <p>{valShow()}</p>
        </Stage>

        <Stage title="panel with time" class="flex items-start">
            <DatePanel min={minmax() ? min : undefined} max={minmax() ? max : undefined} time={!time()} weeks={weeks()}
                weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} value={valWithTime()} weekBase={week()}
                plugins={[datetimePluginLunar]}
                onChange={(val, old) => {
                    setValWithTimeShow(`new:${val},old:${old}`);
                    setValWithTime(val);
                }} />
            <p>{valWithTimeShow()}</p>
        </Stage>

        <Stage title="range panel" class="flex items-start">
            <DateRangePanel min={minmax() ? min : undefined} max={minmax() ? max : undefined} shortcuts={shortcut()} weeks={weeks()}
                weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} weekBase={week()}
                plugins={[datetimePluginLunar]} value={range()}
                onChange={(val, old) => {
                    setRange(val);
                }} />
        </Stage>

        <Stage title="range panel with time" class="flex items-start">
            <DateRangePanel min={minmax() ? min : undefined} max={minmax() ? max : undefined} shortcuts={shortcut()} weeks={weeks()}
                weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} weekBase={week()}
                time value={range()}
                onChange={(val, old) => {
                    setRange(val);
                }} />
        </Stage>
    </Demo>;
}
