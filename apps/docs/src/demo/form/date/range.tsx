// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { DateRangePicker, fieldAccessor, weeks, Week, MountProps, Number } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector, arraySelector } from '../../base';

export default function(props: MountProps) {
    const range = fieldAccessor<[Date, Date], 'date'>('range', [new Date('2024-01-02T15:34'), new Date('2025-01-02T15:34')]);

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
    const [shortcutS, shortcut] = boolSelector('shortcuts(range)');
    const [weekS, week] = arraySelector<Week>('weekBase', weeks);

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {timeS}
            {disabledS}
            {readonlyS}
            {weekendS}
            {roundedS}
            {minmaxS}
            {layoutS}
            {shortcutS}
            {weekS}
        </Portal>

        <div title="range picker">
            <DateRangePicker class="w-[400px]" placeholder='placeholder' layout={layout()}
                label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined}
                weekend={weekend()} palette={palette()} rounded={rounded()} shortcuts={shortcut()}
                readonly={readonly()} disabled={disabled()} accessor={range} weekBase={week()} time={time()} />
        </div>

        <div title="range min-width">
            <DateRangePicker class="w-[200px]" placeholder='placeholder' layout={layout()}
                label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined}
                weekend={weekend()} palette={palette()} rounded={rounded()} shortcuts={shortcut()}
                readonly={readonly()} disabled={disabled()} accessor={range} weekBase={week()} time={time()} />
        </div>
    </>;
}
