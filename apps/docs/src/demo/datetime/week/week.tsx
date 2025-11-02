// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, WeekPanel, WeekValueType, MountProps } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { getISOWeek } from '@cmfx/core';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../../base';


export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector('primary');
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');

    const [value, setValue] = createSignal<WeekValueType | undefined>(undefined);
    const [valShow, setValShow] = createSignal<string>('');

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
            {disabledS}
            {readonlyS}
            <Button onclick={() => setValue()}>set undefined</Button>
            <Button onclick={() => setValue(getISOWeek(new Date()))}>now</Button>
        </Portal>

        <div title="panel" class="flex items-start flex-col">
            <WeekPanel palette={palette()} readonly={readonly()} disabled={disabled()} value={value()}
                onChange={(val, old) => {
                    setValShow(`new:${val}old:${old}`);
                    setValue(val);
                }} />
            <p>{valShow()}</p>
        </div>

        <div title="panel 2" class="flex items-start flex-col">
            <WeekPanel palette={palette()} readonly={readonly()} disabled={disabled()} value={value()}
                onChange={(val, old) => {
                    setValShow(`new:${val}old:${old}`);
                    setValue(val);
                }} />
            <p>{valShow()}</p>
        </div>
    </div>;
}
