// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Drawer, DrawerRef, MountProps } from '@cmfx/components';
import { createMemo, createSignal, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { arraySelector } from '../base';

export default function (props: MountProps) {
    const [breakpointS, breakpoint]
        = arraySelector('breakpoint', ['lg', '2xl', '4xl', '6xl', '8xl', 'true', 'false'], 'lg');
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

    return <>
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
    </>;
}
