// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { Button, NotifyType, notifyTypes } from '@/components';
import { useApp } from '@/context';
import { Demo } from '@/components/base/demo';

export default function() {
    const ctx = useApp();

    const [title, setTitle] = createSignal('title');
    const [body, setBody] = createSignal('body');
    const [timeout, setTimeout] = createSignal<number>(5);
    const [type, setType] = createSignal<NotifyType>('success');

    const notify = async(): Promise<void> => {
        await ctx.notify(title(), body(), type(),timeout());
    };

    return <Demo>
        <div class="flex flex-col gap-2 w-40">
            <select value={type()} onChange={(e) => { setType(e.target.value as NotifyType); }}>
                <For each={notifyTypes}>
                    {(item) => (<option value={item}>{item}</option>)}
                </For>
            </select >
            <input onInput={(e) => { setTitle(e.target.value); }} value={title()} />
            <textarea onInput={(e) => { setBody(e.target.value); }} value={body()} />
            <input type="number" onInput={(e) => { setTimeout(parseInt(e.target.value)); }} value={timeout()} />
            <Button palette='primary' onClick={notify}>notify</Button>
        </div>
    </Demo>;
}
