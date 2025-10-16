// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Counter, CounterRef, fieldAccessor, Number } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    let ref: CounterRef;

    const freq = createSignal(20);
    const fa = fieldAccessor('freq', freq);

    return <div>
        {paletteS}
        <Number accessor={fa} />
        <Counter ref={el => ref = el} palette={palette()} value={500} formatter={(v:number)=>`${v.toFixed(2)}%`} frequency={freq[0]()}  />
        <Button onclick={() => ref.play()}>play</Button>
    </div>;
}
