// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ButtonRef, MountProps, Tooltip, TooltipRef } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { posSelector } from '../base';

export default function (props: MountProps) {
    let ref1: TooltipRef;
    let btn1: ButtonRef;
    const [timeout, setTimeout] = createSignal<number>();
    const [Pos, pos] = posSelector();

    return <>
        <Portal mount={props.mount}>
            <Pos />
            <input type="number" min={-1} max={5000} step={100} onChange={e => setTimeout(parseInt(e.target.value))} />
        </Portal>

        <Button palette='primary' ref={el => btn1 = el} onclick={() => ref1.show(btn1.element(), pos() as any)}>show</Button>
        <Tooltip ref={el => ref1 = el} stays={timeout()}>
            <p>tooltip</p>
            <p>line1<br />line2</p>
        </Tooltip>
    </>;
}
