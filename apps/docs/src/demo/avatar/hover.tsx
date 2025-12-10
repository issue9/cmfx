// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Avatar, MountProps, notify } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconCamera from '~icons/material-symbols/photo-camera';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();

    return <>
        <Portal mount={props.mount}>
            {paletteS}
        </Portal>
        <Avatar value="./not-found.svg" palette={palette()} hover={<IconCamera class="w-8 h-8" />} class="h-16" />
        <Avatar value="./brand-static.svg" palette={palette()} hover={<IconCamera class="w-8 h-8" />} class="h-16"
            onclick={() => notify('click')}
        />
    </>;
}
