// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Scheme, schemes, SchemeSelector, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();
    const s = new Map<string, Scheme>([
        ['Green', schemes.green],
        ['Purple', schemes.purple]
    ]);

    return <>
        <Portal mount={props.mount}>
            {paletteS}
        </Portal>

        <SchemeSelector value='default' palette={palette()} schemes={s} />
    </>;
}
