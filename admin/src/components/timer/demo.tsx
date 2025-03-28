/*
 * SPDX-FileCopyrightText: 2025 caixw
 *
 * SPDX-License-Identifier: MIT
 */

import { boolSelector, Demo, Stage } from '@/components/base/demo';
import { Button } from '@/components/button';
import Timer, { Ref } from './timer';
import { createSignal } from 'solid-js';

export default function () {
    const [fullS, full] = boolSelector('full');
    const [unitS, unit] = boolSelector('unit');
    const [msg, setMsg] = createSignal('');
    
    let ref: Ref;

    return <Demo settings={
        <>
            {fullS}
            {unitS}
        </>
    }>
        <Stage title="-1">
            <Timer unit={unit()} ref={el=>ref=el} duration={'23m34s'} full={full()} interval={-1} autoStart />
            <Button palette="primary" onClick={()=>ref!.toggle()}>toggle</Button>
        </Stage>

        <Stage title="event:-1">
            <Timer unit={unit()} onTick={()=>setMsg('tick')} onComplete={()=>setMsg('complete')} duration={'10s'} full={full()} interval={-1} autoStart />
            <div>{msg()}</div>
        </Stage>

        <Stage title="+1">
            <Timer unit={unit()} duration={'23m34s'} full={full()} interval={1} autoStart />
        </Stage>
    </Demo>;
}