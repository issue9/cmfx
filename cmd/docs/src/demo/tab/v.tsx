// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { FieldOptions, Tab } from '@cmfx/components';
import { createSignal } from 'solid-js';

export default function() {
    const items: FieldOptions<string>
        = [['k1', 'K1'], ['k2', 'K2'], ['k3', 'K3'], ['k4', 'K4']];
    const [tab, setTab] = createSignal('k1');

    return <Tab layout='vertical' palette='primary' items={structuredClone(items)} onChange={setTab}>
        panel:{tab()}
    </Tab>;
}
