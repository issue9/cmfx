// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For } from 'solid-js';

import { paletteSelector, Demo } from '@/components/base/demo';
import Page from './page';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const len: Array<number> = [];
    for (var i = 0; i<100; i++) {
        len.push(i);
    }

    return <Demo settings={paletteS} stages={
        <Page title="title" palette={palette()}>
            <For each={len}>
                {(i)=>(
                    <>{i} <br /></>
                )}
            </For>
        </Page>
    } />;
}