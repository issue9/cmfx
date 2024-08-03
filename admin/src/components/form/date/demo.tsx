// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { boolSelector, Demo } from '@/components/base/demo';
import { FieldAccessor } from '@/components/form';
import { default as DatePanel } from './panel';
import { default as DatePicker } from './picker';
import { Week } from './utils';

export default function() {
    const ac = FieldAccessor('dp', '2024-01-02T15:34', true);
    const [week, setWeek] = createSignal<Week>(0);
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [timeS, time] = boolSelector('time');

    return <Demo settings={
        <>
            {timeS}
            {disabledS}
            {readonlyS}
            {roundedS}

            <input type="number" placeholder='每周起始于' value={week as any} onChange={(e)=>setWeek(parseInt(e.target.value) as Week)} />
        </>

    } stages={
        <>
            <DatePanel readonly={readonly()} disabled={disabled()} accessor={ac} weekBase={week()} time={time()} />
            <DatePicker tabindex={0} rounded={rounded()} readonly={readonly()} disabled={disabled()} accessor={ac} weekBase={week()} time={time()} />
        </>
    } />;
}
