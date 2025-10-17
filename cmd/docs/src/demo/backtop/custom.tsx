// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { BackTop } from '@cmfx/components';
import { For, JSX } from 'solid-js';
import IconNav from '~icons/material-symbols/navigation';

import { paletteSelector } from '../base';

export default function(): JSX.Element {
    const [paletteS, palette] = paletteSelector();
    const len: Array<number> = [];
    for (var i = 0; i<100; i++) {
        len.push(i);
    }

    return <div>
        {paletteS}
        <div class="overflow-y-scroll w-1/3 h-[100px] border border-palette-fg mt-10">
            <For each={len}>
                {i => (
                    <>{i} <br /></>
                )}
            </For>
            <BackTop palette={palette()} class="mb-10">{<IconNav />}</BackTop>
        </div>
    </div>;
}
