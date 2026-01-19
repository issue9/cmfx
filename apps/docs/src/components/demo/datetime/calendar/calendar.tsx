// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Calendar, MountProps, Number, Week, fieldAccessor, notify } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
    const now = new Date();
    const min = new Date(now.getFullYear(), now.getMonth()-2, now.getDate());
    const max = new Date(now.getFullYear(), now.getMonth()+2, now.getDate());;

    const [Palette, palette] = paletteSelector();
    const [Weekend, weekend] = boolSelector('weekend');
    const [Minmax, minmax] = boolSelector('minmax');
    const week = fieldAccessor<Week>('weekbase', 0);

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <Weekend />
            <Minmax />
            <Number min={0} max={6} class="w-20" placeholder='每周起始于' accessor={week} />
        </Portal>

        <div class="w-full h-[600px]">
            <Calendar weekend={weekend()} weekBase={week.getValue()} palette={palette()}
                min={minmax() ? min : undefined} max={minmax() ? max : undefined}
                onSelected={(d: Date) => notify(d.toString())} />
        </div>
    </>;
}
