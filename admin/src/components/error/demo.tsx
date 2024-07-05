// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { Color, colors } from '@/components/base';
import { default as XError } from './error';

export default function() {
    const [color, setColor] = createSignal<Color>();
    return <XError header='404' title='page not found' detail='detail' color={color()}>
        <For each={colors}>
            {(item)=>
                <button class={`mx-2 button--filled scheme--${item}`} onClick={()=>setColor(item)}>{item}</button>
            }
        </For>
    </XError>;
}
