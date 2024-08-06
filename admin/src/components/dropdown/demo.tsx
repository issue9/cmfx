// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { cornerSelector, Demo, paletteSelector } from '@/components/base/demo';
import { Button } from '@/components/button';
import { default as Dropdown } from './dropdown';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [posS,pos] = cornerSelector('bottomleft');
    const [visible1, setVisible1] = createSignal(false);
    const [visible2, setVisible2] = createSignal(false);


    return <Demo settings={
        <>
            {paletteS}
            {posS}
        </>
    } stages={
        <>
            <div>
                <Dropdown wrapperClass="border-2" pos={pos()} palette={palette()} visible={visible1()} activator={
                    <Button palette='primary' onClick={()=>setVisible1(!visible1())}>dropdown</Button>
                }>
                    <div class="p-4 z-5 bg-palette-bg text-palette-fg">dropdown</div>
                </Dropdown>
            </div>

            <div class="w-full">
                <p>自动关闭</p>
                <Dropdown wrapperClass="w-full border-2" setVisible={setVisible2} pos={pos()} palette={palette()} visible={visible2()} activator={
                    <Button palette='primary' onClick={()=>setVisible2(!visible2())}>dropdown</Button>
                }>
                    <div class="p-4 z-5 bg-palette-bg text-palette-fg">点击空白区别，自动关闭。</div>
                </Dropdown>
            </div>
        </>
    } />;
}
