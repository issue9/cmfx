// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { FieldOptions, Tab } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { boolSelector } from '../base';

export default function() {
    const [disabledS, disabled] = boolSelector('disabled');
    const [roundedS, rounded] = boolSelector('rounded');
    const items: FieldOptions<string>
        = [['k1', 'K1'], ['k2', 'K2'], ['k3', 'K3'], ['k4', 'K4']];
    const [tab, setTab] = createSignal<string>('k1');

    return <div>
        {disabledS}
        {roundedS}
        <Tab rounded={rounded()} disabled={disabled()} items={structuredClone(items)} onChange={e=>setTab(e)}>
            <p>TabPanel:{tab()}</p>
        </Tab>
    </div>;
}
