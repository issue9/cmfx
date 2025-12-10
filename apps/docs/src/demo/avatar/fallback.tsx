// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Avatar, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();

    return <>
        <Portal mount={props.mount}>
            {paletteS}
        </Portal>
        <Avatar value="./not-found.svg" palette={palette()} fallback="not-found" class="h-16" />
        <Avatar value="./not-found.svg" palette={palette()} fallback="这是一段很长的文字" class="h-16" />
    </>;
}
