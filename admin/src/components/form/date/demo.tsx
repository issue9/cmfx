// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { FieldAccessor } from '@/components/form';
import { default as DatePanel } from './panel';
import { default as DatePicker } from './picker';
import { Week } from './utils';

export default function() {
    const ac = FieldAccessor('dp', '2024-01-02T15:34', true);
    const [week, setWeek] = createSignal<Week>(0);
    const [disabled, setDisabled] = createSignal(false);
    const [readonly, setReadonly] = createSignal(false);
    const [rounded, setRounded] = createSignal(false);
    const [time, setTime] = createSignal(false);


    return <div class="w-full flex flex-col gap-5">
        <fieldset class="border-2 flex flex-wrap gap-5 p-2">
            <legend>设置</legend>
            <label><input type="checkbox" checked={time()} onChange={()=>setTime(!time())} />time</label>
            <label><input type="checkbox" checked={disabled()} onChange={()=>setDisabled(!disabled())} />disabled</label>
            <label><input type="checkbox" checked={readonly()} onChange={()=>setReadonly(!readonly())} />readonly</label>
            <label><input type="checkbox" checked={rounded()} onChange={()=>setRounded(!rounded())} />rounded</label>
            <input type="number" placeholder='每周起始于' value={week as any} onChange={(e)=>setWeek(parseInt(e.target.value) as Week)} />
        </fieldset>

        <div class="w-full flex gap-5">
            <DatePanel readonly={readonly()} disabled={disabled()} accessor={ac} weekBase={week()} time={time()} />
            <DatePicker rounded={rounded()} readonly={readonly()} disabled={disabled()} accessor={ac} weekBase={week()} time={time()} />
        </div>
    </div>;
}
