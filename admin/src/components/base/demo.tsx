// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, Accessor as getter, Setter } from 'solid-js';
import { Corner, corners, Scheme, schemes } from './index';

export const colorsWithUndefined = [...schemes, undefined] as const;

export function SchemeSelector(props: {get: getter<Scheme|undefined>, set: Setter<Scheme|undefined>}) {
    return <fieldset class="border-2 flex flex-wrap">
        <legend>颜色主题</legend>
        <For each={colorsWithUndefined}>
            {(item)=>(
                <label class="mr-4">
                    <input class="mr-1" type="radio" name="color"
                        value={item} onClick={()=>props.set(item as any)}
                        checked={props.get()===item}
                    />{item ? item : 'undefined'}
                </label>
            )}
        </For>
    </fieldset>;
}

export function CornerSelector(props: {get: getter<Corner>,set: Setter<Corner>}) {
    return <fieldset class="border-2 flex flex-wrap">
        <legend>位置</legend>
        <For each={corners}>
            {(item)=>(
                <label class="mr-4">
                    <input class="mr-1" type="radio" name="color"
                        value={item} onClick={()=>props.set(item as any)}
                        checked={props.get()===item}
                    />{item ? item : 'undefined'}
                </label>
            )}
        </For>
    </fieldset>;
}
