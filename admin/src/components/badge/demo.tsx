// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { corners } from '@/components/base';
import { paletteSelector } from '@/components/base/demo';
import { Button } from '@/components/button';
import { default as Badge } from './badge';

export default function () {
    const [text, setText] = createSignal('');
    const [paletteS, palette] = paletteSelector();

    return <div class="w-80 p-5 flex flex-col justify-around gap-5">
        {paletteS}

        <input type="text" placeholder='text' onInput={(e)=>setText(e.target.value)} />
        <div class="flex items-center gap-5 flex-wrap">
            <For each={corners}>
                {(pos) => (
                    <Badge pos={ pos } palette={ palette() } text={ text() }>
                        <Button palette='primary'>{pos}</Button>
                    </Badge>
                )}
            </For>
        </div>
    </div>;
}
