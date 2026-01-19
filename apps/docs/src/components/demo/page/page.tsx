// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, Page } from '@cmfx/components';
import { For, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconNav from '~icons/material-symbols/navigation';

import { arraySelector, paletteSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const [Palette, palette] = paletteSelector();
    const [Backtop, backtop] = arraySelector('backtop', ['disabled', 'custom', 'default'], 'default');
    const len: Array<number> = [];
    for (let i = 0; i<100; i++) {
        len.push(i);
    }

    return <div>
        <Portal mount={props.mount}>
            <Palette />
            <Backtop />
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
