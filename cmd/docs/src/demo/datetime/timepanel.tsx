// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, TimePanel } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { boolSelector, Demo, paletteSelector, Stage } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');

    const [val, setValue] = createSignal<Date | undefined>(undefined);
    const [valShow, setValShow] = createSignal<string>('');

    return <Demo settings={
        <>
            {paletteS}
            {disabledS}
            {readonlyS}
            <Button onClick={() => setValue()}>set undefined</Button>
            <Button onClick={() => setValue(new Date())}>now</Button>
        </>
    }>
        <Stage title="panel" class="flex items-start">
            <TimePanel palette={palette()} readonly={readonly()} disabled={disabled()} value={val()}
                onChange={(val, old) => {
                    setValShow(`new:${val}old:${old}`);
                    setValue(val);
                }} />
            <p>{valShow()}</p>
        </Stage>
    </Demo>;
}
