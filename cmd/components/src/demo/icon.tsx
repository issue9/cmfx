// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { AnimationIcon, AnimationIconRef, AnimationIconRotation, Button, animationIconRotations } from '@cmfx/components';
import { For, createSignal } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';
import IconPerson from '~icons/material-symbols/person';

import { Demo, Stage } from './base';

export default function() {
    let aref: AnimationIconRef;
    const [rotation, setRotation] = createSignal<AnimationIconRotation>('none');

    return <Demo>
        <IconFace class="bg-palette-bg-low rounded-full hover:text-palette-fg-high" />
        <IconPerson class="border border-palette-fg-high" />

        <span class="w-full border border-red-500 flex items-center bg-palette-fg-high"><IconFace />与文字文字平行<IconClose /></span>
        <span class='text-8xl w-full border border-red-500 flex items-center'><IconFace />与文字平行 6rem<IconClose /></span>

        <span class="h-12 flex items-center w-full border border-red-500"><IconFace />与文字文字平行<IconFace /></span>

        <Stage title="animation">
            <select name="rotation" onChange={e=>setRotation(e.target.value as AnimationIconRotation)}>
                <For each={animationIconRotations}>
                    {(item) => <option value={item}>{item}</option>}
                </For>
            </select>

            <AnimationIcon ref={el => aref = el} icons={{ face: IconFace, close: IconClose }} rotation={rotation()} />

            <Button onClick={() => aref?.to('face')}>face</Button>
            <Button onClick={() => aref?.to('close')}>close</Button>
            <Button onClick={() => aref?.to('not-exists')}>not-exists</Button>
        </Stage>
    </Demo>;
}
