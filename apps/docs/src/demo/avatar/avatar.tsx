// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Avatar, MountProps, notify } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { paletteSelector, boolSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();
    const [roundedS, rounded] = boolSelector('rounded');

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {roundedS}
        </Portal>
        <Avatar value="./brand-static.svg" palette={palette()} rounded={rounded()} class="h-16"
            onclick={() => notify('click')}
        />
    </>;
}
