// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Description, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconEye from '~icons/material-symbols/table-eye';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
        </Portal>

        <Description palette={palette()} icon={<IconEye />} title='title'>
            description<br />
            description
        </Description>

        <br />
        <br />

        <Description palette={palette()}>
            无标题<br />
            description
        </Description>
    </div>;
}
