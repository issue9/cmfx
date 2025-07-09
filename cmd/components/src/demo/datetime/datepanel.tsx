// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, DatePanel, Week } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { boolSelector, Demo, paletteSelector, Stage } from '../base';

export default function() {
    const min = new Date('2023-12-02T15:34');
    const max = new Date('2025-12-02T15:34');
    const [paletteS, palette] = paletteSelector('primary');
    const [week, setWeek] = createSignal<Week>(0);
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [weekendS, weekend] = boolSelector('weekend');
    const [minmaxS, minmax] = boolSelector('minmax');

    const [val, setValue] = createSignal<Date | undefined>(undefined);
    const [valShow, setValShow] = createSignal<string>('');

    return <Demo settings={
        <>
            {paletteS}
            {disabledS}
            {readonlyS}
            {weekendS}
            {minmaxS}
            <input type="number" min="0" max="6" class="w-40" placeholder='每周起始于' value={week as any} onChange={(e) => setWeek(parseInt(e.target.value) as Week)} />
            <Button onClick={()=>setValue()}>set undefined</Button>
            <Button onClick={()=>setValue(new Date())}>now</Button>
        </>
    }>
        <Stage title="panel" class="flex items-start">
            <DatePanel label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined}
                weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} value={val()} weekBase={week()}
                onChange={(val, old)=>{
                    setValShow(`new:${val}old:${old}`);
                    setValue(val);
                }} />
            <p>{valShow()}</p>
        </Stage>

        <Stage title="panel with time" class="flex items-start">
            <DatePanel label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined}
                weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} value={val()} weekBase={week()} time
                onChange={(val, old)=>{
                    setValShow(`new:${val},old:${old}`);
                    setValue(val);
                }} />
            <p>{valShow()}</p>
        </Stage>
    </Demo>;
}
