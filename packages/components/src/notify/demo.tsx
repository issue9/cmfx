// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { Demo } from '@components/base/demo';
import { Button } from '@components/button';
import { initNotify, notify, Type, types } from './notify';

export default function() {
    initNotify(true);

    const [title, setTitle] = createSignal('title');
    const [body, setBody] = createSignal('body');
    const [timeout, setTimeout] = createSignal<number>(5000);
    const [type, setType] = createSignal<Type>('success');

    const notify1 = async(): Promise<void> => {
        await notify(title(), body(), type(), 'zh-Hans', timeout());
    };

    return <Demo>
        <div class="flex flex-col gap-2 w-40">
            <select value={type()} onChange={(e) => { setType(e.target.value as Type); }}>
                <For each={types}>
                    {(item) => (<option value={item}>{item}</option>)}
                </For>
            </select >
            <input onInput={(e) => { setTitle(e.target.value); }} value={title()} />
            <textarea onInput={(e) => { setBody(e.target.value); }} value={body()} />
            <input type="number" step={500} onInput={(e) => { setTimeout(parseInt(e.target.value)); }} value={timeout()} />
            <Button palette='primary' onClick={notify1}>notify</Button>
        </div>
    </Demo>;
}
