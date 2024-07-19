// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { corners, Palette } from '@/components/base';
import { PaletteSelector } from '@/components/base/demo';
import { default as Badge } from './badge';

export default function () {
    const [text, setText] = createSignal('');
    const [palette, setPalette] = createSignal<Palette>();

    return <div class="w-80 p-5 flex flex-col justify-around gap-5">
        <PaletteSelector set={setPalette} get={palette} />

        <input type="text" placeholder='text' onInput={(e)=>setText(e.target.value)} />
        <div class="flex items-center gap-5 flex-wrap">
            <For each={corners}>
                {(pos) => (
                    <Badge pos={ pos } palette={ palette() } text={ text() }>
                        <button class="button filled palette--primary">{ pos }</button >
                    </Badge>
                )}
            </For>
        </div>
    </div>;
}
