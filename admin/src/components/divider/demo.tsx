// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { Scheme } from '@/components/base';
import { SchemeSelector } from '@/components/base/demo';
import { default as Divider, Props } from './divider';

export default function() {
    const [scheme, setScheme] = createSignal<Scheme>();
    const [pos, setPos] = createSignal<Props['pos']>('start');

    return <div class="w-80 p-5">
        <SchemeSelector get={scheme} set={setScheme} />

        <fieldset class="border-2">
            <legend>位置</legend>
            <For each={new Array<Props['pos']>('start','center','end')}>
                {(item)=>(
                    <label class="mr-4">
                        <input class="mr-1" type="radio" name="type" value={item} onClick={()=>setPos(item)} checked={pos()===item} />{item}
                    </label>
                )}
            </For>
        </fieldset>

        <br /><br />

        <Divider scheme={scheme()} pos={pos()}><span class="material-symbols-outlined">face</span>起始位置</Divider>

        <br /><br />
        <Divider scheme={scheme()} pos={pos()}></Divider>
    </div>;
}
