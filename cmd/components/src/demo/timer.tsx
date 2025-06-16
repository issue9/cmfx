// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Timer, timerFields, TimerRef } from '@cmfx/components';
import { createSignal } from 'solid-js';
import IconFace from '~icons/material-symbols/face';

import { arraySelector, boolSelector, Demo, Stage } from './base';

export default function () {
    const [unitS, unit] = boolSelector('unit');
    const [fieldS, field] = arraySelector('field', timerFields, 'minutes');
    const [msg, setMsg] = createSignal('');

    let ref: TimerRef;

    return <Demo settings={
        <>
            {unitS}
            {fieldS}
        </>
    }>
        <Stage title="-1">
            <Timer unit={unit()} ref={el=>ref=el} duration={'23m34s'} startField={field()} interval={-1} autoStart />
            <Button palette="primary" onClick={()=>ref!.toggle()}>切换暂停和启动状态</Button>
        </Stage>

        <Stage title="event:-1">
            <Timer unit={unit()} onTick={()=>setMsg('tick')} onComplete={()=>setMsg('complete')} duration={'10s'} startField={field()} interval={-1} autoStart />
            <div>{msg()}</div>
        </Stage>

        <Stage title="+1">
            <Timer separator={<IconFace />} unit={unit()} duration={'23m34s'} startField={field()} interval={1} autoStart />
        </Stage>
    </Demo>;
}