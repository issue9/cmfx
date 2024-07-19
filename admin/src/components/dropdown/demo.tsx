// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { Corner, Palette } from '@/components/base';
import { CornerSelector, PaletteSelector } from '@/components/base/demo';
import { Button } from '@/components/button';
import { default as Dropdown } from './dropdown';

export default function() {
    const [palette, setPalette] = createSignal<Palette>();
    const [pos, setPos] = createSignal<Corner>('bottomleft');
    const [visible, setVisible] = createSignal(false);

    return <div class="p-5 flex flex-col items-center gap-5">
        <div class="flex justify-around gap-2">
            <PaletteSelector set={setPalette} get={palette} />
            <CornerSelector get={pos} set={setPos} />
        </div>

        <Dropdown pos={pos()} palette={palette()} visible={visible()} activator={
            <Button palette='primary' onClick={()=>setVisible(!visible())}>dropdown</Button>
        }>
            <div class="p-4 z-5">dropdown</div>
        </Dropdown>

    </div>;
}
