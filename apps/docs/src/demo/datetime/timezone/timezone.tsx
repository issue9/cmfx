// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, Timezone } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../../base';

export default function (props: MountProps) {
    const [Palette, palette] = paletteSelector('primary');
    const [timezone, setTimezone] = createSignal<string>('Asia/Shanghai');

    return <div>
        <Portal mount={props.mount}>
            <Palette />
        </Portal>

        <Timezone value={timezone()} palette={palette()} onChange={d => setTimezone(d)} />
        <span>{timezone()}</span>
    </div>;
}
