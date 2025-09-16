// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Tab, TabItem } from '@cmfx/components';
import { createSignal } from 'solid-js';


export default function() {
    const items: Array<TabItem> = [
        { id: 'k1', label: 'K1' },
        { id: 'k2', label: 'K22222' },
        { id: 'k3', label: 'K3' },
        { id: 'k4', label: 'K4' },
    ];
    const [tab, setTab] = createSignal<string>('k1');

    return <div>
        <Tab palette="primary" items={structuredClone(items)} onChange={e=>setTab(e)}>
            <p>TabPanel:{tab()}</p>
        </Tab>
    </div>;
}
