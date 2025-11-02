// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Tab, TabItem } from '@cmfx/components';
import { createSignal } from 'solid-js';

export default function() {
    const items: Array<TabItem> = [
        { id: 'k1', label: 'K1' },
        { id: 'k2', label: 'K2222222' },
        { id: 'k3', label: 'K3', disabled: true },
        { id: 'k4', label: 'K4' },
    ];
    const [tab, setTab] = createSignal('k1');

    return <Tab layout='vertical' palette='primary' items={structuredClone(items)} onChange={setTab}>
        panel:{tab()}
    </Tab>;
}
