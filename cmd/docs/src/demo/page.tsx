// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Page } from '@cmfx/components';
import { For } from 'solid-js';

import { Demo, boolSelector, paletteSelector } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [disableBackTopS, disableBackTop] = boolSelector('disable backtop');
    const len: Array<number> = [];
    for (let i = 0; i<100; i++) {
        len.push(i);
    }

    return <Demo settings={
        <>
            {paletteS}
            {disableBackTopS}
        </>
    }>
        <Page title='title' palette={palette()} backtop={disableBackTop() === true ? false : undefined}>
            <For each={len}>
                {(i) => (
                    <>{i} <br /></>
                )}
            </For>
        </Page>
    </Demo>;
}
