// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    IconSet, IconSetRef, IconSetRotation, Button, iconSetRotations, MountProps
} from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';
import IconPerson from '~icons/material-symbols/person';

import { arraySelector, paletteSelector } from '../base';

export default function(props: MountProps) {
    let aref: IconSetRef;
    const [rotationS, rotation] = arraySelector<IconSetRotation>('rotation', iconSetRotations, 'none');
    const [paletteS, palette] = paletteSelector();

    return <div>
        <Portal mount={props.mount}>
            {rotationS}
            {paletteS}
        </Portal>

        <Button>
            <IconSet palette={palette()} class="w-8 aspect-square" ref={el => aref = el} icons={{
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
