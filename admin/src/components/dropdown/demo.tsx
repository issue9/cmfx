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
    const [visible1, setVisible1] = createSignal(false);
    const [visible2, setVisible2] = createSignal(false);

    return <div class="p-5 flex flex-col items-center gap-5">
        <div class="flex justify-around gap-2">
            <PaletteSelector set={setPalette} get={palette} />
            <CornerSelector get={pos} set={setPos} />
        </div>

        <Dropdown wrapperClass="border-2" pos={pos()} palette={palette()} visible={visible1()} activator={
            <Button palette='primary' onClick={()=>setVisible1(!visible1())}>dropdown</Button>
        }>
            <div class="p-4 z-5 bg-palette text-palette">dropdown</div>
        </Dropdown>

        <p>自动关闭</p>

        <Dropdown wrapperClass="w-full border-2" setVisible={setVisible2} pos={pos()} palette={palette()} visible={visible2()} activator={
            <Button palette='primary' onClick={()=>setVisible2(!visible2())}>dropdown</Button>
        }>
            <div class="p-4 z-5 bg-palette text-palette">点击空白区别，自动关闭。</div>
        </Dropdown>

    </div>;
}
