// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, MonthPanel, YearPanel } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { boolSelector, Demo, paletteSelector, Stage } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [minmaxS, minmax] = boolSelector('minmax');

    const [month, setMonthValue] = createSignal<Date | undefined>(new Date());
    const [monthShow, setMonthShow] = createSignal<string>('');

    const [year,setYearValue] = createSignal<number | undefined>((new Date()).getFullYear());
    const [yearShow, setYearShow] = createSignal<string>('');

    const now = new Date();
    return <Demo settings={
        <>
            {paletteS}
            {disabledS}
            {readonlyS}
            {minmaxS}
            <Button onclick={() => setMonthValue()}>set undefined</Button>
            <Button onclick={() => setMonthValue(new Date())}>current</Button>
        </>
    }>
        <Stage title="panel" class="flex items-start">
            <MonthPanel palette={palette()} readonly={readonly()} disabled={disabled()} value={month()}
                min={minmax() ? new Date(new Date().setMonth(now.getMonth() - 1)) : undefined}
                max={minmax() ? new Date(new Date().setMonth(now.getMonth() + 8)) : undefined}
                onChange={(val, old) => {
                    setMonthShow(`new:${val}old:${old}`);
                    setMonthValue(val);
                }} />
            <p>{monthShow()}</p>
        </Stage>

        <Stage title="panel" class="flex items-start">
            <YearPanel palette={palette()} readonly={readonly()} disabled={disabled()} value={year()}
                min={minmax() ? now.getFullYear() - 2 : undefined}
                max={minmax() ? now.getFullYear() + 8 : undefined}
                onChange={(val, old) => {
                    setYearShow(`new:${val}old:${old}`);
                    setYearValue(val);
                }} />
            <p>{yearShow()}</p>
        </Stage>
    </Demo>;
}
