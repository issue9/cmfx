// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { DatePicker, fieldAccessor, Week, MountProps } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const ac = fieldAccessor<Date, 'date'>('dp', new Date('2024-01-02T15:34'));
    const ac2 = fieldAccessor<number | undefined, 'number'>('dp', undefined, 'number');

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
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
            {timeS}
            {disabledS}
            {readonlyS}
            {weekendS}
            {roundedS}
            {minmaxS}
            {layoutS}
            <input type="number" min="0" max="6" class="w-40" placeholder='每周起始于'
                value={week as any} onChange={(e) => setWeek(parseInt(e.target.value) as Week)} />
        </Portal>

        <div>
            <DatePicker class="w-[400px]" placeholder='placeholder' layout={layout()}
                label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined}
                weekend={weekend()} palette={palette()} rounded={rounded()}
                readonly={readonly()} disabled={disabled()} accessor={ac} weekBase={week()} time={time()} />
        </div>

        <div title="min-width">
            <DatePicker class="w-[200px]" placeholder='placeholder' layout={layout()}
                label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined}
                weekend={weekend()} palette={palette()} rounded={rounded()}
                readonly={readonly()} disabled={disabled()} accessor={ac2} weekBase={week()} time={time()} />
            <p>{ac2.getValue()}</p>
        </div>
    </div>;
}
