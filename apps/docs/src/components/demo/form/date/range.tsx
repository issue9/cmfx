// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { DateRangePicker, fieldAccessor, MountProps, Week, weeks } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector, boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const dateFA = fieldAccessor<[Date, Date], 'date'>('range', [new Date('2024-01-02T15:34'), new Date('2025-01-02T15:34')]);
    const numberFA = fieldAccessor<[number|undefined, number|undefined], 'number'>('range', [undefined, 1765000000000], 'number');

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
    const [Shortcut, shortcut] = boolSelector('shortcuts(range)');

    return <>
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
            <Shortcut />
        </Portal>

        <DateRangePicker class="w-[400px]" placeholder='placeholder' layout={layout()}
            label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined}
            weekend={weekend()} palette={palette()} rounded={rounded()} shortcuts={shortcut()}
            readonly={readonly()} disabled={disabled()} accessor={dateFA} weekBase={week()} time={time()} />
        <p>{dateFA.getValue().join('-') ?? ''}</p>

        <DateRangePicker class="w-[200px]" placeholder='placeholder' layout={layout()}
            label='label' min={minmax() ? min : undefined} max={minmax() ? max : undefined}
            weekend={weekend()} palette={palette()} rounded={rounded()} shortcuts={shortcut()}
            readonly={readonly()} disabled={disabled()} accessor={numberFA} weekBase={week()} time={time()} />
        <p>{numberFA.getValue().join('-') ?? ''}</p>
    </>;
}
