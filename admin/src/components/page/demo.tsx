// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For } from 'solid-js';

import { Demo, boolSelector, paletteSelector } from '@/components/base/demo';
import { Page } from './page';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [disableBackTopS, disableBackTop] = boolSelector('disable backtop');
    const len: Array<number> = [];
    for (var i = 0; i<100; i++) {
        len.push(i);
    }

    return <Demo settings={
        <>
            {paletteS}
            {disableBackTopS}
        </>
    }>
        <Page title="title" palette={palette()} disableBacktop={disableBackTop()}>
            <For each={len}>
                {(i) => (
                    <>{i} <br /></>
                )}
            </For>
        </Page>
    </Demo>;
}