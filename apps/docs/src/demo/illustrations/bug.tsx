// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps } from '@cmfx/components';
import * as illustrations from '@cmfx/illustrations';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();

    return <>
        <Portal mount={props.mount}>
            {paletteS}
        </Portal>

        <illustrations.BUG class='bg-palette-bg aspect-square w-full' palette={palette()} />
    </>;
}
