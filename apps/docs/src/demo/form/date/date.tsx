// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { DatePicker, fieldAccessor, Week, MountProps, weeks } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { arraySelector, boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const dateFA = fieldAccessor<Date, 'date'>('dp', new Date('2024-01-02T15:34'));
    const numberFA = fieldAccessor<number | undefined, 'number'>('dp', undefined, 'number');

    const min = new Date('2023-12-02T15:34');
    const max = new Date('2025-12-02T15:34');
    const [paletteS, palette] = paletteSelector('primary');
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [weekendS, weekend] = boolSelector('weekend');
    const [timeS, time] = boolSelector('time');
    const [minmaxS, minmax] = boolSelector('minmax');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const [weekS, week] = arraySelector<Week>('weekBase', weeks);

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
            {weekS}
        </Portal>

        <DatePicker class="w-[400px]" placeholder='placeholder' layout={layout()}
            label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined}
            weekend={weekend()} palette={palette()} rounded={rounded()}
            readonly={readonly()} disabled={disabled()} accessor={dateFA} weekBase={week()} time={time()} />
        <p>{dateFA.getValue().toString() ?? 'undefined'}</p>

        <DatePicker class="w-[200px]" placeholder='placeholder' layout={layout()}
            label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined}
            weekend={weekend()} palette={palette()} rounded={rounded()}
            readonly={readonly()} disabled={disabled()} accessor={numberFA} weekBase={week()} time={time()} />
        <p>{numberFA.getValue() ?? 'undefined'}</p>
    </div>;
}
