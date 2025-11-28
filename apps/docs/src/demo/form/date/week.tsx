// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, Week, WeekPicker, WeekValueType, MountProps } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const weekNum = fieldAccessor<WeekValueType>('week', [2025, 7]);

    const min = new Date('2023-12-02T15:34');
    const max = new Date('2025-12-02T15:34');
    const [paletteS, palette] = paletteSelector('primary');
    const [week, setWeek] = createSignal<Week>(0);
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [weekendS, weekend] = boolSelector('weekend');
    const [minmaxS, minmax] = boolSelector('minmax');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {disabledS}
            {readonlyS}
            {weekendS}
            {roundedS}
            {minmaxS}
            {layoutS}
            <input type="number" min="0" max="6" class="w-40" placeholder='每周起始于'
                value={week as any} onChange={(e) => setWeek(parseInt(e.target.value) as Week)} />
        </Portal>

        <WeekPicker class="w-[400px]" placeholder='placeholder' layout={layout()}
            label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined}
            weekend={weekend()} palette={palette()} rounded={rounded()}
            readonly={readonly()} disabled={disabled()} accessor={weekNum} weekBase={week()} />

        <WeekPicker class="w-[200px]" placeholder='placeholder' layout={layout()}
            label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined}
            weekend={weekend()} palette={palette()} rounded={rounded()}
            readonly={readonly()} disabled={disabled()} accessor={weekNum} weekBase={week()} />
    </>;
}
