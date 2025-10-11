// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    AnimationIcon, AnimationIconRef, AnimationIconRotation, Button, animationIconRotations
} from '@cmfx/components';
import { For, createSignal } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';
import IconPerson from '~icons/material-symbols/person';

export default function() {
    let aref: AnimationIconRef;
    const [rotation, setRotation] = createSignal<AnimationIconRotation>('none');

    return <div>
        <select name="rotation" onChange={e => setRotation(e.target.value as AnimationIconRotation)}>
            <For each={animationIconRotations}>
                {item => <option value={item}>{item}</option>}
            </For>
        </select>

        <Button>
            <AnimationIcon class="w-8 aspect-square" ref={el => aref = el} icons={{
                face: <IconFace />,
                close: <IconClose />,
                person: <IconPerson />,
            }} rotation={rotation()} />
        </Button>

        <Button onclick={() => aref?.to('face')}>face</Button>
        <Button onclick={() => aref?.to('close')}>close</Button>
        <Button onclick={() => aref?.to('not-exists')}>not-exists</Button>

        <Button onclick={() => aref?.next()}>next</Button>
        <Button onclick={() => aref?.prev()}>prev</Button>
    </div>;
}
