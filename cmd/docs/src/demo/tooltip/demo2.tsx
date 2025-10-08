// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ButtonRef, Tooltip, TooltipRef } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { posSelector } from '../base';

export default function () {
    let ref1: TooltipRef;
    let btn1: ButtonRef;
    const [timeout, setTimeout] = createSignal<number>();

    const [posS, pos] = posSelector();

    return <>
        {posS}
        <input type="number" min={-1} max={5000} step={100} onChange={e => setTimeout(parseInt(e.target.value))} />
        <Button ref={el => btn1 = el} onclick={() => ref1.show(btn1.element(), pos())}>show</Button>
        <Tooltip ref={el => ref1 = el} stays={timeout()}>
            <p>tooltip/tooltip</p>
            <p>line1<br />line2</p>
        </Tooltip>
    </>;
}
