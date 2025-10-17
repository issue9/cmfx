// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Drawer, DrawerRef } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { arraySelector, paletteSelector } from '../base';

export default function () {
    const [paletteS, palette] = paletteSelector('secondary');
    const [posS, pos] = arraySelector('pos', ['start', 'end'], 'start');
    const [visible, setVisible] = createSignal(true);
    let ref: DrawerRef;

    return <div>
        {paletteS}
        {posS}
        {<Button onclick={() => {
            setVisible(!visible());
            ref.toggle();
        }}>toggle</Button>}

        <Drawer ref={el => ref = el} pos={pos()} palette={palette()} visible={true} floating main={
            <main class="h-full bg-primary-bg">abc<br /><br /><br />
                <br /><br /><br />hij
            </main>
        }>
            <div class="h-full border-palette-border min-w-20">aside<br /></div>
        </Drawer>
        <br />
        {ref!.ToggleButton()}
    </div>;
}
