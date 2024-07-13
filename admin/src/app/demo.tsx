// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { NotifyType } from '@/components';
import { useApp } from './context';

export default function() {
    const ctx = useApp();

    const [title, setTitle] = createSignal('title');
    const [body, setBody] = createSignal('body');
    const [timeout, setTimeout] = createSignal<number>(5);
    const [type, setType] = createSignal<NotifyType>('success');

    const notify = () => {
        ctx.notify(title(), body(), type(),timeout());
    };

    return <div class="flex flex-col gap-2">
        <select value={type()} onChange={(e) => { setType(e.target.value as NotifyType); }}>
            <option value='error'>error</option>
            <option value='success'>success</option>
            <option value='warning'>warning</option>
            <option value='info'>info</option>
        </select >
        <input onInput={(e) => { setTitle(e.target.value); }} value={title()} />
        <textarea onInput={(e) => { setBody(e.target.value); }} value={body()} />
        <input type="number" onInput={(e) => { setTimeout(parseInt(e.target.value)); }} value={timeout()} />
        <button class="button filled scheme--primary" onClick={notify}>notify</button>
    </div >;
}
