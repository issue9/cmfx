// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Breakpoint, breakpoints, Button, Drawer, DrawerRef, MountProps } from '@cmfx/components';
import { createMemo, createSignal, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector } from '../base';

export default function (props: MountProps) {
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

    const [ref, setRef] = createSignal<DrawerRef>();

    return <div>
        <Portal mount={props.mount}>
            {breakpointS}
            {posS}
        </Portal>


        <Button onclick={() => { ref()?.toggle(); }}>ref.toggle</Button>

        <Show when={ref()}>
            {ref()!.ToggleButton()}
        </Show>
        <Drawer ref={setRef} pos={pos()} palette='primary' visible={true} floating={bp()} main={
            <main class="h-full bg-secondary-bg">abc<br /><br /><br />
                <br /><br /><br />hij
            </main>
        }>
            <div class="h-full border-palette-border min-w-20">aside<br /></div>
        </Drawer>
    </div>;
}
