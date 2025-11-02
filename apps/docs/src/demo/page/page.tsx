// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Page, MountProps } from '@cmfx/components';
import { For } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconNav from '~icons/material-symbols/navigation';

import { paletteSelector, arraySelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();
    const [backtopS, backtop] = arraySelector('backtop', ['disabled', 'custom', 'default'], 'default');
    const len: Array<number> = [];
    for (let i = 0; i<100; i++) {
        len.push(i);
    }

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
            {backtopS}
        </Portal>

        <Page title='title' palette={palette()} backtop={backtop() === 'disabled' ? false : (backtop() === 'custom' ? { children: <IconNav />, class: 'end-10' } : undefined)}>
            <For each={len}>
                {i => (
                    <>{i} <br /></>
                )}
            </For>
        </Page>
    </div>;
}
