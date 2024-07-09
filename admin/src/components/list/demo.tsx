// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { Color, colors } from '@/components/base';
import { XDivider } from '@/components/divider';
import { default as XItem } from './item';
import { default as XList } from './list';

export default function() {
    const [c, setC] = createSignal<Color>();

    return <div class="flex flex-col gap-2">
        <fieldset class="border-2">
            <legend>颜色</legend>
            <For each={colors}>
                {(item)=>(
                    <label class="mr-4">
                        <input class="mr-1" type="radio" name="type" value={item} onClick={()=>setC(item)} checked={c()===item} />{item}
                    </label>
                )}
            </For>
            <label class="mr-4">
                <input class="mr-1" type="radio" name="type" value={undefined} onClick={()=>setC(undefined)} checked={c()===undefined} />undefined
            </label>
        </fieldset>

        <XList color={c()}>
            <XItem text="item" head='face'>
                <XItem text="current" head='face' to="/demo/list" />
                <XDivider />
                <XItem text="item2" />
                <XItem text="item3" />
            </XItem>
            <XDivider />
            <XItem text="errors" head='face' to="/demo/errors" />
            <XItem text="item2" head='face' />
            <XItem text="item2" head='face'>
                <XItem text="item" />
            </XItem>
        </XList >
    </div >;
}
