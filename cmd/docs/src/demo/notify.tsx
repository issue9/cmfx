// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, notify, NotifyType, notifyTypes, useLocale } from '@cmfx/components';
import { createSignal, For } from 'solid-js';

import { Demo } from './base';

export default function() {
    const [title, setTitle] = createSignal('title');
    const [body, setBody] = createSignal('body');
    const [timeout, setTimeout] = createSignal<number>(5000);
    const [type, setType] = createSignal<NotifyType>('success');
    const l = useLocale();

    const notify1 = async(): Promise<void> => {
        await notify(title(), body(), type(), l.locale.toString(), timeout());
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
            <input type="number" step={500} onInput={(e) => { setTimeout(parseInt(e.target.value)); }} value={timeout()} />
            <Button palette='primary' onclick={notify1}>notify</Button>
        </div>
    </Demo>;
}
