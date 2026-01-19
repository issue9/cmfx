// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, Result } from '@cmfx/components';
import { Error404 } from '@cmfx/illustrations';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const [Palette, palette] = paletteSelector('primary');

    return <>
        <Portal mount={props.mount}>
            <Palette />
        </Portal>

        <Result layout='vertical' title='page not found' palette={palette()} illustration={<Error404 />} />
    </>;
}
