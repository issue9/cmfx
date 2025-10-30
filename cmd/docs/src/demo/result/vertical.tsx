// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Result, MountProps } from '@cmfx/components';
import { Error404 } from '@cmfx/illustrations';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector('primary');

    return <>
        <Portal mount={props.mount}>
            {paletteS}
        </Portal>

        <Result layout='vertical' title='page not found' palette={palette()} illustration={<Error404 />} />
    </>;
}
