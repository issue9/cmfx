// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, MountProps, Week, WeekPicker, WeekValueType } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const weekNum = fieldAccessor<WeekValueType>('week', [2025, 7]);

    const min = new Date('2023-12-02T15:34');
    const max = new Date('2025-12-02T15:34');
    const [week, setWeek] = createSignal<Week>(0);

    const [Palette, palette] = paletteSelector('primary');
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded');
    const [Weekend, weekend] = boolSelector('weekend');
    const [Minmax, minmax] = boolSelector('minmax');
    const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <Disabled />
            <Readonly />
            <Weekend />
            <Rounded />
            <Minmax />
            <Layout />
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
