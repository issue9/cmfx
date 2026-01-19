// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, DateRangePanel, DateRangeValueType, datetimePluginLunar, MountProps, Week } from '@cmfx/components';
import { createSignal, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const now = new Date();
    const min = new Date(now.getFullYear(), now.getMonth()-2, now.getDate());
    const max = new Date(now.getFullYear(), now.getMonth()+2, now.getDate());;

    const [Palette, palette] = paletteSelector('primary');
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Weekend, weekend] = boolSelector('weekend');
    const [Minmax, minmax] = boolSelector('minmax');
    const [Weeks, weeks] = boolSelector('weeks');
    const [Shortcut, shortcut] = boolSelector('shortcuts(range)');
    const [week, setWeek] = createSignal<Week>(0);
    const [range, setRange] = createSignal<DateRangeValueType>();

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <Disabled />
            <Readonly />
            <Weekend />
            <Minmax />
            <Weeks />
            <Shortcut />
            <input type="number" min="0" max="6" class="w-40" placeholder='每周起始于' value={week as any} onChange={(e) => setWeek(parseInt(e.target.value) as Week)} />
            <Button onclick={() => {
                setRange();
            }}>set undefined</Button>
            <Button onclick={() => {
                const now = new Date();
                const next = new Date(now);
                next.setMonth(next.getMonth() + 1);
                setRange([now, next]);
            }}>now</Button>
        </Portal>

        <DateRangePanel min={minmax() ? min : undefined} max={minmax() ? max : undefined} shortcuts={shortcut()} weeks={weeks()}
            weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} weekBase={week()}
            plugins={[datetimePluginLunar]} value={range()}
            onChange={(val) => {
                setRange(val);
            }} />

        <DateRangePanel min={minmax() ? min : undefined} max={minmax() ? max : undefined} shortcuts={shortcut()} weeks={weeks()}
            weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} weekBase={week()}
            time value={range()}
            onChange={(val) => {
                setRange(val);
            }} />
    </>;
}
