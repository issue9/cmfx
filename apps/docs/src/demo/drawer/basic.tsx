// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Drawer, DrawerRef, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { arraySelector, paletteSelector } from '../base';

export default function (props: MountProps) {
    const [paletteS, palette] = paletteSelector('secondary');
    const [posS, pos] = arraySelector('pos', ['start', 'end'], 'start');
    let ref: DrawerRef;

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {posS}
        </Portal>

        <Drawer ref={el => ref = el} pos={pos()} palette={palette()} visible={true} floating main={
            <main class="h-full bg-primary-bg">abc<br /><br /><br />
                <br /><br /><br />hij
            </main>
        }>
            <div class="h-full border-palette-border min-w-20">aside<br /></div>
        </Drawer>

        {ref!.ToggleButton({ square: true, class: 'grow-0' })}
        <Button onclick={() => { ref.toggle(); }}>ref.toggle</Button>
    </>;
}
