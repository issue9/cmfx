// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, DatePanel, datetimePluginLunar, Week, MountProps } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const now = new Date();
    const min = new Date(now.getFullYear(), now.getMonth()-2, now.getDate());
    const max = new Date(now.getFullYear(), now.getMonth()+2, now.getDate());;

    const [paletteS, palette] = paletteSelector('primary');
    const [week, setWeek] = createSignal<Week>(0);
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [weekendS, weekend] = boolSelector('weekend');
    const [weeksS, weeks] = boolSelector('weeks');
    const [minmaxS, minmax] = boolSelector('minmax');
    const [timeS, time] = boolSelector('time');

    const [val, setValue] = createSignal<Date | undefined>(undefined);
    const [valWithTime, setValWithTime] = createSignal<Date | undefined>(undefined);
    const [valShow, setValShow] = createSignal<string>('');
    const [valWithTimeShow, setValWithTimeShow] = createSignal<string>('');

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
            {disabledS}
            {readonlyS}
            {weekendS}
            {minmaxS}
            {timeS}
            {weeksS}
            <input type="number" min="0" max="6" class="w-40" placeholder='每周起始于' value={week as any} onChange={(e) => setWeek(parseInt(e.target.value) as Week)} />
            <Button onclick={() => {
                setValue();
                setValWithTime();
            }}>set undefined</Button>
            <Button onclick={() => {
                const now = new Date();
                const next = new Date(now);
                next.setMonth(next.getMonth() + 1);
                setValue(now);
                setValWithTime(now);
            }}>now</Button>
        </Portal>

        <div class="flex items-start flex-col">
            <DatePanel time={time()} min={minmax() ? min : undefined} max={minmax() ? max : undefined} weeks={weeks()}
                weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} value={val()} weekBase={week()}
                onChange={(val, old) => {
                    setValShow(`new:${val}old:${old}`);
                    setValue(val);
                }} />
            <p>{valShow()}</p>
        </div>

        <div class="flex items-start flex-col">
            <DatePanel min={minmax() ? min : undefined} max={minmax() ? max : undefined} time={!time()} weeks={weeks()}
                weekend={weekend()} palette={palette()} readonly={readonly()} disabled={disabled()} value={valWithTime()} weekBase={week()}
                plugins={[datetimePluginLunar]}
                onChange={(val, old) => {
                    setValWithTimeShow(`new:${val},old:${old}`);
                    setValWithTime(val);
                }} />
            <p>{valWithTimeShow()}</p>
        </div>
    </div>;
}
