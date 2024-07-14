// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { Scheme } from '@/components/base';
import { colorsWithUndefined } from '@/components/base/demo';
import { default as ErrorPage } from './error';

export default function() {
    const [color, setColor] = createSignal<Scheme>();
    return <ErrorPage header='404' title='page not found' detail='detail' scheme={color()}>
        <For each={colorsWithUndefined}>
            {(item)=>
                <button class={`mx-2 button filled scheme--${item}`} onClick={()=>setColor(item)}>{item ? item : 'undefined'}</button>
            }
        </For>
    </ErrorPage>;
}
