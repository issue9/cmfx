// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, IconSet, IconSetRef, IconSetRotation, iconSetRotations, MountProps } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';
import IconPerson from '~icons/material-symbols/person';

import { arraySelector, paletteSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    let aref: IconSetRef;
    const [Rotation, rotation] = arraySelector<IconSetRotation>('rotation', iconSetRotations, 'none');
    const [Palette, palette] = paletteSelector();

    return <div class="gap-2 flex flex-col">
        <Portal mount={props.mount}>
            <Rotation />
            <Palette />
        </Portal>

        <Button palette={palette()}>
            <IconSet class="w-8! aspect-square" ref={el => aref = el} icons={{
                face: <IconFace />,
                close: <IconClose />,
                person: <IconPerson />,
            }} rotation={rotation()} />
        </Button>

        <Button palette={palette()} onclick={() => aref?.to('face')}>face</Button>
        <Button palette={palette()} onclick={() => aref?.to('close')}>close</Button>
        <Button palette={palette()} onclick={() => aref?.to('not-exists')}>not-exists</Button>

        <Button palette={palette()} onclick={() => aref?.next()}>next</Button>
        <Button palette={palette()} onclick={() => aref?.prev()}>prev</Button>
    </div>;
}
