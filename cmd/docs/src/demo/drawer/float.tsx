// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Breakpoint, breakpoints, Button, Drawer, DrawerRef } from '@cmfx/components';
import { createMemo, createSignal, Show } from 'solid-js';

import { arraySelector } from '../base';

export default function () {
    const [breakpointS, breakpoint]
        = arraySelector<Breakpoint | 'true' | 'false'>('breakpoint', [...breakpoints, 'true', 'false'], 'md');
    const [posS, pos] = arraySelector('pos', ['start', 'end'], 'start');

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
    const [ref, setRef] = createSignal<DrawerRef>();

    return <div>
        {breakpointS}
        {posS}
        {<Button onclick={() => {
            setVisible(!visible());
            ref()?.toggle();
        }}>show</Button>}
        <br />
        <Show when={ref()}>
            {ref()!.ToggleButton()}
        </Show>
        <Drawer ref={setRef} pos={pos()} palette='primary' visible={visible()} floating={bp()} main={
            <main class="h-full bg-secondary-bg">abc<br /><br /><br />
                <br /><br /><br />hij
            </main>
        }>
            <div class="h-full border-palette-border min-w-20">aside<br /></div>
        </Drawer>
    </div>;
}
