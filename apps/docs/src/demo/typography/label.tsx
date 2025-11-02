// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Label, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconEye from '~icons/material-symbols/table-eye';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();

    return <>
        <Portal mount={props.mount}>
            {paletteS}
        </Portal>

        <Label palette={palette()} icon={<IconEye />} tag='div'>Label</Label>
    </>;
}
