// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { Color } from '@/components/base';
import { ColorSelector } from '@/components/base/demo';
import { positions, default as XBadge } from './badge';

export default function () {
    const [text, setText] = createSignal('');
    const [c, setC] = createSignal<Color>();

    return <div class="w-80 p-5 flex flex-col justify-around gap-5">
        <ColorSelector setter={setC} getter={c} />

        <input type="text" placeholder='text' onInput={(e)=>setText(e.target.value)} />
        <div class="flex items-center gap-5 flex-wrap">
            <For each={positions}>
                {(pos) => (
                    <XBadge pos={pos} color={c() } text={text()}>
                        <button class="button filled scheme--primary">{pos}</button >
                    </XBadge>
                )}
            </For>
        </div>
    </div>;
}
