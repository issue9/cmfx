// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, WeekPanel, WeekValueType } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { getISOWeek } from '@cmfx/core';
import { boolSelector, Demo, paletteSelector, Stage } from '../base';


export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');

    const [value, setValue] = createSignal<WeekValueType | undefined>(undefined);
    const [valShow, setValShow] = createSignal<string>('');

    return <Demo settings={
        <>
            {paletteS}
            {disabledS}
            {readonlyS}
            <Button onClick={() => setValue()}>set undefined</Button>
            <Button onClick={() => setValue(getISOWeek(new Date()))}>now</Button>
        </>
    }>
        <Stage title="panel" class="flex items-start">
            <WeekPanel palette={palette()} readonly={readonly()} disabled={disabled()} value={value()}
                onChange={(val, old) => {
                    setValShow(`new:${val}old:${old}`);
                    setValue(val);
                }} />
            <p>{valShow()}</p>
        </Stage>

        <Stage title="panel 2" class="flex items-start">
            <WeekPanel palette={palette()} readonly={readonly()} disabled={disabled()} value={value()}
                onChange={(val, old) => {
                    setValShow(`new:${val}old:${old}`);
                    setValue(val);
                }} />
            <p>{valShow()}</p>
        </Stage>
    </Demo>;
}
