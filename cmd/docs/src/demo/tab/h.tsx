// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, Tab, TabItem } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const items: Array<TabItem> = [
        { id: 'k1', label: 'K1' },
        { id: 'k2', label: 'K22222' },
        { id: 'k3', label: 'K3', disabled: true },
        { id: 'k4', label: 'K4' },
    ];

    const [paletteS, palette] = paletteSelector();

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
        </Portal>

        <Tab class="w-fit!" palette={palette()} items={structuredClone(items)} />
    </div>;
}
