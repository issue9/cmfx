// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { corners, Scheme } from '@/components/base';
import { SchemeSelector } from '@/components/base/demo';
import { default as Badge } from './badge';

export default function () {
    const [text, setText] = createSignal('');
    const [scheme, setScheme] = createSignal<Scheme>();

    return <div class="w-80 p-5 flex flex-col justify-around gap-5">
        <SchemeSelector set={setScheme} get={scheme} />

        <input type="text" placeholder='text' onInput={(e)=>setText(e.target.value)} />
        <div class="flex items-center gap-5 flex-wrap">
            <For each={corners}>
                {(pos) => (
                    <Badge pos={ pos } scheme={ scheme() } text={ text() }>
                        <button class="button filled scheme--primary">{ pos }</button >
                    </Badge>
                )}
            </For>
        </div>
    </div>;
}
