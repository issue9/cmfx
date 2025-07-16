// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, DatePanel, DateRangePanel, datetimePluginLunar, RangeValueType, Week } from '@cmfx/components';
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
    const [minmaxS, minmax] = boolSelector('minmax');
    const [timeS, time] = boolSelector('time');
    const [shortcutS, shortcut] = boolSelector('shortcuts(range)');

    const [val, setValue] = createSignal<Date | undefined>(undefined);
    const [valWithTime, setValWithTime] = createSignal<Date | undefined>(undefined);
    const [valShow, setValShow] = createSignal<string>('');
    const [valWithTimeShow, setValWithTimeShow] = createSignal<string>('');

    const [range, setRange] = createSignal<RangeValueType>([undefined, undefined]);
    const [rangeShow, setRangeShow] = createSignal<string>('');

    return <Demo settings={
        <>
            {paletteS}
            {disabledS}
            {readonlyS}
            {weekendS}
            {minmaxS}
            {timeS}
            {shortcutS}
            <input type="number" min="0" max="6" class="w-40" placeholder='每周起始于' value={week as any} onChange={(e) => setWeek(parseInt(e.target.value) as Week)} />
            <Button onClick={() => { setValue(); setValWithTime(); }}>set undefined</Button>
            <Button onClick={() => { setValue(new Date()); setValWithTime(new Date()); }}>now</Button>
        </>
    }>
        <Stage title="panel" class="flex items-start">
            <DatePanel time={time()} min={minmax() ? min : undefined} max={minmax() ? max : undefined}
                weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} value={val()} weekBase={week()}
                onChange={(val, old)=>{
                    setValShow(`new:${val}old:${old}`);
                    setValue(val);
                }} />
            <p>{valShow()}</p>
        </Stage>

        <Stage title="panel with time" class="flex items-start">
            <DatePanel min={minmax() ? min : undefined} max={minmax() ? max : undefined} time={!time()}
                weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} value={valWithTime()} weekBase={week()}
                plugins={[datetimePluginLunar]}
                onChange={(val, old)=>{
                    setValWithTimeShow(`new:${val},old:${old}`);
                    setValWithTime(val);
                }} />
            <p>{valWithTimeShow()}</p>
        </Stage>

        <Stage title="range panel" class="flex items-start">
            <DateRangePanel min={minmax() ? min : undefined} max={minmax() ? max : undefined} value={range()} shortcuts={shortcut()}
                weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} weekBase={week()}
                plugins={[datetimePluginLunar]}
                onChange={(val, old)=>{
                    setRangeShow(`new:${val}old:${old}`);
                    setRange(val);
                }} />
            <p>{valShow()}</p>
        </Stage>

        <Stage title="range panel with time" class="flex items-start">
            <DateRangePanel min={minmax() ? min : undefined} max={minmax() ? max : undefined} shortcuts={shortcut()}
                weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} weekBase={week()} time
                onChange={(val, old)=>{
                    //setRangeShow(`new:${val},old:${old}`);
                    //setRange(val);
                }} />
            <p>{valShow()}</p>
        </Stage>
    </Demo>;
}
