// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { corners } from '@admin/components/base';
import { Demo, paletteSelector } from '@admin/components/base/demo';
import { Button } from '@admin/components/button';
import { Badge } from './badge';

export default function () {
    const [text, setText] = createSignal('');
    const [paletteS, palette] = paletteSelector();

    return <Demo settings={
        <>
            {paletteS}
            <input type="text" placeholder='text' onInput={(e)=>setText(e.target.value)} />
        </>
    }>
        <For each={corners}>
            {(pos) => (
                <Badge pos={ pos } palette={ palette() } text={ text() }>
                    <Button palette='primary'>{pos}</Button>
                </Badge>
            )}
        </For>
    </Demo>;
}
