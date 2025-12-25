// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, Result } from '@cmfx/components';
import { Error404 } from '@cmfx/illustrations';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [Palette, palette] = paletteSelector('primary');

    return <>
        <Portal mount={props.mount}>
            <Palette />
        </Portal>

        <Result layout='vertical' title='page not found' palette={palette()} illustration={<Error404 />} />
    </>;
}
