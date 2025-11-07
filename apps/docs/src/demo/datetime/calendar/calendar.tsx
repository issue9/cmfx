// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Calendar, Number, notify, Week, MountProps, fieldAccessor } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../../base';

export default function (props: MountProps) {
    const now = new Date();
    const min = new Date(now.getFullYear(), now.getMonth()-2, now.getDate());
    const max = new Date(now.getFullYear(), now.getMonth()+2, now.getDate());;

    const [paletteS, palette] = paletteSelector();
    const [weekendS, weekend] = boolSelector('weekend');
    const [minmaxS, minmax] = boolSelector('minmax');
    const week = fieldAccessor<Week>('weekbase', 0);

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {weekendS}
            {minmaxS}
            <Number min={0} max={6} class="w-20" placeholder='每周起始于' accessor={week} />
        </Portal>

        <div class="w-full h-[600px]">
            <Calendar weekend={weekend()} weekBase={week.getValue()} palette={palette()}
                min={minmax() ? min : undefined} max={minmax() ? max : undefined}
                onSelected={(d: Date) => notify(d.toString())} />
        </div>
    </>;
}
