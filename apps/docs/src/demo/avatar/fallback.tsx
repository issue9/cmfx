// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Avatar, MountProps } from '@cmfx/components';
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
        <Avatar rounded={rounded()} value="./not-found.svg" palette={palette()} fallback="not-found" class="h-16" />
        <Avatar rounded={rounded()} value="./not-found.svg" palette={palette()} fallback="这是一段很长的文字" class="h-16" />
    </>;
}
