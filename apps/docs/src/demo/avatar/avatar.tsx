// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Avatar, MountProps, notify } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../base';

export default function(props: MountProps) {
    const [Palette, palette] = paletteSelector('primary');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded', true);

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <Rounded />
        </Portal>
        <Avatar value="./brand-static.svg" palette={palette()} rounded={rounded()} class="h-16"
            onclick={() => notify('click')}
        />
    </>;
}
