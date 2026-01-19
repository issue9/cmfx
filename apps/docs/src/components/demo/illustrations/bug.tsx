// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps } from '@cmfx/components';
import * as illustrations from '@cmfx/illustrations';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const [Palette, palette] = paletteSelector();

    return <>
        <Portal mount={props.mount}>
            <Palette />
        </Portal>

        <illustrations.BUG class='bg-palette-bg aspect-square w-full' palette={palette()} />
    </>;
}
