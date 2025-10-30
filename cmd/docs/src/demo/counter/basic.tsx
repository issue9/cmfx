// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, MountProps, Counter, CounterRef, fieldAccessor, Number } from '@cmfx/components';
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

        <Counter ref={el => ref = el} palette={palette()} value={500} frequency={fa.getValue()} />
        <Button onclick={() => ref.play()}>play</Button>
    </div>;
}
