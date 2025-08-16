// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Breakpoint, Button, Drawer } from '@cmfx/components';

import { breakpoints } from '@cmfx/components';
import { createMemo, createSignal } from 'solid-js';
import { arraySelector, Demo, paletteSelector } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    const [breakpointS, breakpoint]
        = arraySelector<Breakpoint | 'true' | 'false'>('breakpoint', [...breakpoints, 'true', 'false'], 'md');
    const [posS, pos] = arraySelector('pos', ['left', 'right'], 'left');

    const bp = createMemo(() => {
        const v = breakpoint();
        switch (v) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            return v;
        }
    });

    const [visible, setVisible] = createSignal(true);
    return <Demo settings={
        <>
            {paletteS}
            {breakpointS}
            {posS}
            {<Button onclick={()=>setVisible(!visible())}>show</Button>}
        </>
    }>
        <Drawer pos={pos()} palette={palette()} visible={visible()} floating={bp()} main={
            <main class="h-full bg-primary-bg">abc<br /><br /><br />
                <br /><br /><br />hij
            </main>
        }>
            <div class="h-full border-palette-bg-low min-w-20">aside<br /></div>
        </Drawer>
    </Demo>;
}
