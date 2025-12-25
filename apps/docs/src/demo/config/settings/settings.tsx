// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, Settings } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../../base';

export default function(props: MountProps) {
    const [Palette, palette] = paletteSelector();
    return <div class="m-auto">
        <Portal mount={props.mount}>
            <Palette />
        </Portal>

        <Settings palette={palette()} />
    </div>;
}
