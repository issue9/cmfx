// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { DatePicker, fieldAccessor, MountProps, Week, weeks } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { arraySelector, boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const dateFA = fieldAccessor<Date, 'date'>('dp', new Date('2024-01-02T15:34'));
    const numberFA = fieldAccessor<number | undefined, 'number'>('dp', undefined, 'number');

    const min = new Date('2023-12-02T15:34');
    const max = new Date('2025-12-02T15:34');
    const [Palette, palette] = paletteSelector('primary');
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded');
    const [Weekend, weekend] = boolSelector('weekend');
    const [Time, time] = boolSelector('time');
    const [Minmax, minmax] = boolSelector('minmax');
    const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
    const [Week, week] = arraySelector<Week>('weekBase', weeks);

    return <div>
        <Portal mount={props.mount}>
            <Palette />
            <Time />
            <Disabled />
            <Readonly />
            <Weekend />
            <Rounded />
            <Minmax />
            <Layout />
            <Week />
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
