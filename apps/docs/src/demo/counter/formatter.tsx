// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Counter, CounterRef, fieldAccessor, MountProps, Number } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector('primary');
    let ref: CounterRef;
    const fa = fieldAccessor('freq', 20);

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
            <Number class="w-20" accessor={fa} />
        </Portal>
        <Counter start={999} ref={el => ref = el} palette={palette()} value={500} formatter={(v:number)=>`${v.toFixed(2)}%`} frequency={fa.getValue()}  />
        <Button onclick={() => ref.play()}>play</Button>
    </div>;
}
