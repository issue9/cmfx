// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { Palette } from '@/components/base';
import { colorsWithUndefined } from '@/components/base/demo';
import { default as ErrorPage } from './errorpage';

export default function() {
    const [palette, setPalette] = createSignal<Palette>();
    return <ErrorPage header='404' title='page not found' detail='detail' palette={palette()}>
        <For each={colorsWithUndefined}>
            {(item)=>
                <button class={`mx-2 button filled palette--${item}`} onClick={()=>setPalette(item)}>{item ? item : 'undefined'}</button>
            }
        </For>
    </ErrorPage>;
}
