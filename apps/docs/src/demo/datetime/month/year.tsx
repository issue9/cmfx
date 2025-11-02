// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { YearPanel, MountProps } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector('primary');
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [minmaxS, minmax] = boolSelector('minmax');

    const [year,setYearValue] = createSignal<number | undefined>((new Date()).getFullYear());
    const [yearShow, setYearShow] = createSignal<string>('');

    const now = new Date();
    return <div>
        <Portal mount={props.mount}>
            {paletteS}
            {disabledS}
            {readonlyS}
            {minmaxS}
        </Portal>

        <div title="panel" class="flex items-start">
            <YearPanel palette={palette()} readonly={readonly()} disabled={disabled()} value={year()}
                min={minmax() ? now.getFullYear() - 2 : undefined}
                max={minmax() ? now.getFullYear() + 8 : undefined}
                onChange={(val, old) => {
                    setYearShow(`new:${val}old:${old}`);
                    setYearValue(val);
                }} />
            <p>{yearShow()}</p>
        </div>
    </div>;
}
