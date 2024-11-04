// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For } from 'solid-js';

import { Demo, paletteSelector } from '@/components/base/demo';
import BackTop from './backtop';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const len: Array<number> = [];
    for (var i = 0; i<100; i++) {
        len.push(i);
    }

    let scroller: HTMLElement;
    return <Demo settings={paletteS} stages={
        <div ref={el=>scroller=el} class="overflow-y-scroll w-full h-[500px] border border-palette-fg mt-10">
            <For each={len}>
                {(i)=>(
                    <>{i} <br /></>
                )}
            </For>
            <BackTop scroller={scroller!} palette={palette()} class="mb-10" />
        </div>
    } />;
}