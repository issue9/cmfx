// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { IconCmfxBrandStatic, IconCmfxBrandAnimate, MountProps, joinClass } from '@cmfx/components';
import { paletteSelector } from '../base';
import { Portal } from 'solid-js/web';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();
    return <>
        <Portal mount={props.mount}>
            {paletteS}
        </Portal>

        <p>
            <IconCmfxBrandAnimate class={joinClass(palette(), 'text-5xl', 'text-palette-fg')} />
            <IconCmfxBrandStatic class={joinClass(palette(), 'text-5xl', 'text-palette-fg')} />
        </p>
    </>;
}
