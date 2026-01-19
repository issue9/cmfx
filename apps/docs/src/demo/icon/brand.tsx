// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { IconCmfxBrandAnimate, IconCmfxBrandStatic, MountProps, joinClass } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [Palette, palette] = paletteSelector();
    return <>
        <Portal mount={props.mount}>
            <Palette />
        </Portal>

        <p>
            <IconCmfxBrandAnimate class={joinClass(palette(), 'text-5xl', 'text-palette-fg')} />
            <IconCmfxBrandStatic class={joinClass(palette(), 'text-5xl', 'text-palette-fg')} />
        </p>
    </>;
}
