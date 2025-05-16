// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Badge, badgeCorners, Button } from '@cmfx/components';
import { createSignal, For } from 'solid-js';

import { Demo, paletteSelector } from './base';

export default function () {
    const [text, setText] = createSignal('');
    const [paletteS, palette] = paletteSelector();

    return <Demo settings={
        <>
            {paletteS}
            <input type="text" placeholder='text' onInput={(e)=>setText(e.target.value)} />
        </>
    }>
        <For each={badgeCorners}>
            {(pos) => (
                <Badge pos={ pos } palette={ palette() } text={ text() }>
                    <Button palette='primary'>{pos}</Button>
                </Badge>
            )}
        </For>
    </Demo>;
}
