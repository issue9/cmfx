// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Dropdown, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector('primary');
    return <div>
        <Portal mount={props.mount}>
            {paletteS}
        </Portal>

        <Dropdown palette={palette()} items={[]}>
            <div class="bg-primary-bg text-primary-fg w-full h-full">click</div>
        </Dropdown>
    </div>;
}
