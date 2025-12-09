// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Settings, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();

    return <div class="m-auto">
        <Portal mount={props.mount}>
            {paletteS}
        </Portal>

        <Settings palette={palette()} />
    </div>;
}
