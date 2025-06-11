// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ButtonRef, Tooltip, TooltipRef } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { Demo, Stage, posSelector } from './base';

export default function () {
    let ref1: TooltipRef;
    let btn1: ButtonRef;
    
    const [timeout, setTimeout] = createSignal<number>();

    const [posS, pos] = posSelector();
    return <Demo settings={
        <>
            {posS}
            <input type="number" min={-1} max={5000} step={100} onChange={e=>setTimeout(parseInt(e.target.value))} />
        </>
    }>
        <Stage>
            <Button ref={el => btn1 = el} onclick={() => ref1.show(btn1, pos(), timeout())}>show</Button>
            <Tooltip ref={el => ref1 = el}>
                <p>tooltip</p>
                <p>line1<br />line2</p>
            </Tooltip>
        </Stage>
    </Demo>;
}