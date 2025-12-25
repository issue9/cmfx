// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, Scheme, schemes, SchemeSelector } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../../base';

export default function(props: MountProps) {
    const [Palette, palette] = paletteSelector();
    const s = new Map<string, Scheme>([
        ['Green', schemes.green],
        ['Purple', schemes.purple]
    ]);

    return <>
        <Portal mount={props.mount}>
            <Palette />
        </Portal>

        <SchemeSelector value='default' palette={palette()} schemes={s} />
    </>;
}
