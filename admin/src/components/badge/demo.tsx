// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { postions, default as XBadge } from './badge';

export default function () {
    const [text, setText] = createSignal('');

    return <div class="w-80 p-5 flex flex-col justify-around gap-5">
        <input type="text" placeholder='text' onInput={(e)=>setText(e.target.value)} />
        <div class="flex items-center gap-5 flex-wrap">
            <For each={postions}>
                {(pos)=>(
                    <XBadge pos={pos} color='secondary' text={text()}>
                        <button class="button filled scheme--primary">{pos}</button >
                    </XBadge>
                )}
            </For>
        </div>
    </div>;
}
