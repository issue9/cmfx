// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Tab, TabItem } from '@cmfx/components';
import { For } from 'solid-js';

import { palettesWithUndefined } from '../base';

export default function() {
    const items: Array<TabItem> = [
        { id: 'k1', label: 'K1' },
        { id: 'k2', label: 'K22222' },
        { id: 'k3', label: 'K3', disabled: true },
        { id: 'k4', label: 'K4' },
    ];

    return <div>
        <For each={palettesWithUndefined}>
            {(c) => (
                <>
                    <Tab palette={c} items={structuredClone(items)} />
                    <br />
                </>
            )}
        </For>
    </div>;
}
