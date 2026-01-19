// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, MonthPanel, MountProps } from '@cmfx/components';
import { createSignal, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const [Palette, palette] = paletteSelector('primary');
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Minmax, minmax] = boolSelector('minmax');

    const [month, setMonthValue] = createSignal<Date | undefined>(new Date());
    const [monthShow, setMonthShow] = createSignal<string>('');

    const now = new Date();
    return <div>
        <Portal mount={props.mount}>
            <Palette />
            <Disabled />
            <Readonly />
            <Minmax />
            <Button onclick={() => setMonthValue()}>set undefined</Button>
            <Button onclick={() => setMonthValue(new Date())}>current</Button>
        </Portal>

        <div title="panel" class="flex items-start">
            <MonthPanel palette={palette()} readonly={readonly()} disabled={disabled()} value={month()}
                min={minmax() ? new Date(new Date().setMonth(now.getMonth() - 1)) : undefined}
                max={minmax() ? new Date(new Date().setMonth(now.getMonth() + 8)) : undefined}
                onChange={(val, old) => {
                    setMonthShow(`new:${val}old:${old}`);
                    setMonthValue(val);
                }} />
            <p>{monthShow()}</p>
        </div>
    </div>;
}
