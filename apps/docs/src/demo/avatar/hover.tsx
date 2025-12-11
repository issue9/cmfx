// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Avatar, Badge, MountProps, notify } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconCamera from '~icons/material-symbols/photo-camera';

import { paletteSelector, boolSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector('primary');
    const [roundedS, rounded] = boolSelector('rounded', true);

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {roundedS}
        </Portal>

        <Avatar rounded={rounded()} value="./not-found.svg" fallback="?" palette={palette()} hover={<IconCamera class="w-8 h-8" />} class="h-16" />

        <Badge content="New" palette='primary'>
            <Avatar rounded={rounded()} value="./brand-static.svg" palette={palette()} hover={<IconCamera class="w-8 h-8" />} class="h-16"
                onclick={() => notify('click')}
            />
        </Badge>
    </>;
}
