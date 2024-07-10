// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, Accessor as getter, Setter } from 'solid-js';
import { Color, colors } from './index';

export const colorsWithUndefined = [...colors, undefined] as const;

export function ColorSelector(props: {getter: getter<Color|undefined>,setter: Setter<Color|undefined>}) {

    return <fieldset class="border-2">
        <legend>颜色</legend>
        <For each={colorsWithUndefined}>
            {(item)=>(
                <label class="mr-4">
                    <input class="mr-1" type="radio" name="color"
                        value={item} onClick={()=>props.setter(item as any)}
                        checked={props.getter()===item}
                    />{item ? item : 'undefined'}
                </label>
            )}
        </For>
    </fieldset>
}
